import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useReveal } from "@/hooks/useReveal";
import {
  adminApi,
  EntrepreneurLessonItem,
  StartupStoryItem,
  CorporateGirlieItem,
  EventDocumentaryItem,
  AuthorNoteItem,
  HomeReaderItem,
  RealitySeriesItem,
  RegistrationItem,
} from "@/lib/adminContentApi";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

type TabType =
  | "lessons"
  | "stories"
  | "reality"
  | "corporate"
  | "events"
  | "notes"
  | "home_reader"
  | "subscribers";

/* ═══════════════════════════════════════════════════════
   BLOCK-BASED CONTENT EDITOR
   Blocks: 'text' (rich contenteditable) | 'image' | 'video'
   Content serialised as JSON string: ContentBlock[]
═══════════════════════════════════════════════════════ */

interface TextBlock {
  id: string;
  type: "text";
  html: string;
}
interface MediaBlock {
  id: string;
  type: "image" | "video";
  url: string;
  caption: string;
}
type ContentBlock = TextBlock | MediaBlock;

const uid = () => Math.random().toString(36).slice(2, 9);

function parseBlocks(content?: string): ContentBlock[] {
  if (!content) return [{ id: uid(), type: "text", html: "" }];
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}
  return [{ id: uid(), type: "text", html: content.replace(/\n/g, "<br>") }];
}

const serialiseBlocks = (blocks: ContentBlock[]) => JSON.stringify(blocks);

function sanitisePastedHtml(raw: string): string {
  const div = document.createElement("div");
  div.innerHTML = raw;

  div.querySelectorAll("script,style,meta,link,title").forEach((el) => el.remove());

  div.querySelectorAll("*").forEach((el) => {
    const tag = el.tagName.toLowerCase();
    const cls = el.getAttribute("class") || "";

    if (tag === "p" && /MsoHeading2|Heading2|heading-2/i.test(cls)) {
      const h = document.createElement("h2");
      h.innerHTML = el.innerHTML;
      el.replaceWith(h);
      return;
    }
    if (tag === "p" && /MsoHeading3|Heading3|heading-3/i.test(cls)) {
      const h = document.createElement("h3");
      h.innerHTML = el.innerHTML;
      el.replaceWith(h);
      return;
    }

    [...el.attributes].forEach((a) => el.removeAttribute(a.name));
  });

  div.querySelectorAll("span").forEach((span) => {
    const parent = span.parentNode;
    if (parent) {
      while (span.firstChild) parent.insertBefore(span.firstChild, span);
      span.remove();
    }
  });

  return div.innerHTML;
}

function AddBlockRow({ onAdd }: { onAdd: (type: "text" | "image" | "video") => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex items-center justify-center py-1 group">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-border/40 group-hover:bg-primary/30 transition-colors" />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative z-10 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary bg-card border border-border px-2.5 py-1 rounded-full shadow-sm transition-all"
      >
        <span>+ Add Block</span>
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-30 flex items-center gap-1 bg-card border border-border p-1 rounded-lg shadow-xl">
          <button
            type="button"
            onClick={() => {
              onAdd("text");
              setOpen(false);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-xs hover:bg-primary/15 hover:text-primary transition-colors font-medium"
          >
            <span>Text</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onAdd("image");
              setOpen(false);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-xs hover:bg-primary/15 hover:text-primary transition-colors font-medium"
          >
            <span>Image</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onAdd("video");
              setOpen(false);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-xs hover:bg-primary/15 hover:text-primary transition-colors font-medium"
          >
            <span>Video</span>
          </button>
        </div>
      )}
    </div>
  );
}

function TextBlockEditor({
  block,
  onChange,
  onRemove,
}: {
  block: TextBlock;
  onChange: (html: string) => void;
  onRemove: () => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = block.html;
  }, []);

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");
    if (html.trim()) {
      document.execCommand("insertHTML", false, sanitisePastedHtml(html));
    } else {
      document.execCommand("insertText", false, text);
    }
  };

  return (
    <div className="group/block relative border border-border/60 rounded-xl bg-background/60 p-3 space-y-2">
      <div className="flex items-center justify-between border-b border-border/40 pb-2 text-xs">
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => exec("bold")} className="px-2 py-0.5 rounded font-bold hover:bg-muted" title="Bold">B</button>
          <button type="button" onClick={() => exec("italic")} className="px-2 py-0.5 rounded italic hover:bg-muted" title="Italic">I</button>
          <button type="button" onClick={() => exec("formatBlock", "<h2>")} className="px-2 py-0.5 rounded font-bold hover:bg-muted" title="Heading 2">H2</button>
          <button type="button" onClick={() => exec("formatBlock", "<h3>")} className="px-2 py-0.5 rounded font-bold hover:bg-muted" title="Heading 3">H3</button>
          <button type="button" onClick={() => exec("formatBlock", "<p>")} className="px-2 py-0.5 rounded hover:bg-muted" title="Paragraph">P</button>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors px-1"
          title="Remove block"
        >
          ✕ Delete
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={() => editorRef.current && onChange(editorRef.current.innerHTML)}
        onPaste={handlePaste}
        data-placeholder="Type paragraph text, paste Google Docs content..."
        className="min-h-[6rem] max-h-[22rem] overflow-y-auto outline-none text-sm text-foreground/90 leading-relaxed space-y-2 focus:ring-1 focus:ring-primary/40 rounded p-1"
      />
    </div>
  );
}

function MediaBlockEditor({
  block,
  onChange,
  onRemove,
}: {
  block: MediaBlock;
  onChange: (b: MediaBlock) => void;
  onRemove: () => void;
}) {
  return (
    <div className="border border-border/60 rounded-xl bg-background/60 p-3 space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-primary">
        <span>{block.type === "image" ? "Image Block" : "Video Block"}</span>
        <button type="button" onClick={onRemove} className="text-muted-foreground hover:text-destructive">✕ Delete</button>
      </div>
      <Input
        type="url"
        placeholder={block.type === "image" ? "Image URL (e.g. https://...)" : "Video URL (e.g. https://youtube.com/...)"}
        value={block.url}
        onChange={(e) => onChange({ ...block, url: e.target.value })}
        className="bg-background/80 text-xs"
      />
      <Input
        placeholder="Caption / description"
        value={block.caption}
        onChange={(e) => onChange({ ...block, caption: e.target.value })}
        className="bg-background/80 text-xs"
      />
    </div>
  );
}

function BlockEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (jsonStr: string) => void;
}) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => parseBlocks(value));

  const updateBlocks = (next: ContentBlock[]) => {
    setBlocks(next);
    onChange(serialiseBlocks(next));
  };

  const handleBlockChange = (id: string, updated: ContentBlock) => {
    updateBlocks(blocks.map((b) => (b.id === id ? updated : b)));
  };

  const handleRemove = (id: string) => {
    if (blocks.length === 1) {
      updateBlocks([{ id: uid(), type: "text", html: "" }]);
    } else {
      updateBlocks(blocks.filter((b) => b.id !== id));
    }
  };

  const handleAdd = (index: number, type: "text" | "image" | "video") => {
    const newBlock: ContentBlock =
      type === "text"
        ? { id: uid(), type: "text", html: "" }
        : { id: uid(), type, url: "", caption: "" };
    const next = [...blocks];
    next.splice(index + 1, 0, newBlock);
    updateBlocks(next);
  };

  return (
    <div className="space-y-2 border border-border/80 rounded-xl p-4 bg-muted/20">
      <div className="flex items-center justify-between border-b border-border/40 pb-2">
        <label className="font-semibold text-xs uppercase tracking-wider text-primary">Content Blocks</label>
        <span className="text-[11px] text-muted-foreground">{blocks.length} block(s)</span>
      </div>

      <div className="space-y-2">
        {blocks.map((block, idx) => (
          <div key={block.id} className="space-y-2">
            {block.type === "text" ? (
              <TextBlockEditor
                block={block}
                onChange={(html) => handleBlockChange(block.id, { ...block, html })}
                onRemove={() => handleRemove(block.id)}
              />
            ) : (
              <MediaBlockEditor
                block={block}
                onChange={(b) => handleBlockChange(block.id, b)}
                onRemove={() => handleRemove(block.id)}
              />
            )}
            <AddBlockRow onAdd={(t) => handleAdd(idx, t)} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN ADMIN COMPONENT
═══════════════════════════════════════════════════════ */

export default function Admin() {
  useReveal();
  const [activeTab, setActiveTab] = useState<TabType>("lessons");

  // Direct Link Passcode Gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("unmasking_admin_auth") === "true";
  });
  const [passkeyInput, setPasskeyInput] = useState("");
  const [authError, setAuthError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = passkeyInput.trim();
    if (cleanKey === "unmasking-admin-2026" || cleanKey === "admin") {
      sessionStorage.setItem("unmasking_admin_auth", "true");
      setIsAuthenticated(true);
      setAuthError("");
      toast.success("Admin session unlocked!");
    } else {
      setAuthError("Invalid access key. Please verify and try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("unmasking_admin_auth");
    setIsAuthenticated(false);
    toast.info("Admin session locked.");
  };

  // Data States
  const [lessons, setLessons] = useState<EntrepreneurLessonItem[]>([]);
  const [stories, setStories] = useState<StartupStoryItem[]>([]);
  const [realitySeries, setRealitySeries] = useState<RealitySeriesItem[]>([]);
  const [corporateItems, setCorporateItems] = useState<CorporateGirlieItem[]>([]);
  const [events, setEvents] = useState<EventDocumentaryItem[]>([]);
  const [notes, setNotes] = useState<AuthorNoteItem[]>([]);
  const [homeReader, setHomeReader] = useState<HomeReaderItem[]>([]);
  const [subscribers, setSubscribers] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Form Modal States
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Real-time synchronization hook
  const { isConnected } = useRealtimeSync("all", () => {
    if (isAuthenticated) loadAllData(false);
  });

  const loadAllData = async (showLoading = true) => {
    if (showLoading) setLoading(true);

    try {
      const [l, s, r, c, e, n, hr, sub] = await Promise.allSettled([
        adminApi.getLessons(false),
        adminApi.getStartupStories(false),
        adminApi.getRealitySeries(false),
        adminApi.getCorporateGirlies(false),
        adminApi.getEvents(false),
        adminApi.getNotes(false),
        adminApi.getHomeReader(false),
        adminApi.getRegistrations(),
      ]);
      if (l.status === "fulfilled") setLessons(l.value || []);
      if (s.status === "fulfilled") setStories(s.value || []);
      if (r.status === "fulfilled") setRealitySeries(r.value || []);
      if (c.status === "fulfilled") setCorporateItems(c.value || []);
      if (e.status === "fulfilled") setEvents(e.value || []);
      if (n.status === "fulfilled") setNotes(n.value || []);
      if (hr.status === "fulfilled") setHomeReader(hr.value || []);
      if (sub.status === "fulfilled") setSubscribers(sub.value || []);
    } catch {
      toast.error("Failed to load backend data.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSeedDatabase = async () => {
    try {
      const res = await adminApi.seed();
      toast.success(res.message || "Database seeded successfully!");
      loadAllData();
    } catch (err: any) {
      toast.error(err.message || "Failed to seed database.");
    }
  };

  // ── CRUD handlers ──────────────────────────────────────

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem.id) {
        await adminApi.updateLesson(editingItem.id, editingItem);
        toast.success("Lesson updated!");
      } else {
        await adminApi.createLesson(editingItem);
        toast.success("Lesson created!");
      }
      setIsModalOpen(false);
      loadAllData(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save lesson");
    }
  };

  const handleDeleteLesson = async (id: number) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      await adminApi.deleteLesson(id);
      toast.success("Lesson deleted!");
      loadAllData(false);
    } catch {
      toast.error("Failed to delete lesson");
    }
  };

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem.id) {
        await adminApi.updateStartupStory(editingItem.id, editingItem);
        toast.success("Story updated!");
      } else {
        await adminApi.createStartupStory(editingItem);
        toast.success("Story created!");
      }
      setIsModalOpen(false);
      loadAllData(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save story");
    }
  };

  const handleDeleteStory = async (id: number) => {
    if (!confirm("Delete this story?")) return;
    try {
      await adminApi.deleteStartupStory(id);
      toast.success("Story deleted!");
      loadAllData(false);
    } catch {
      toast.error("Failed to delete story");
    }
  };

  const handleSaveRealitySeries = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem.id) {
        await adminApi.updateRealitySeries(editingItem.id, editingItem);
        toast.success("Documentary Series updated!");
      } else {
        await adminApi.createRealitySeries(editingItem);
        toast.success("Documentary Series created!");
      }
      setIsModalOpen(false);
      loadAllData(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save series");
    }
  };

  const handleDeleteRealitySeries = async (id: number) => {
    if (!confirm("Delete this series and all its episodes?")) return;
    try {
      await adminApi.deleteRealitySeries(id);
      toast.success("Series deleted!");
      loadAllData(false);
    } catch {
      toast.error("Failed to delete series");
    }
  };

  const handleSaveCorporate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem.id) {
        await adminApi.updateCorporateGirlie(editingItem.id, editingItem);
        toast.success("Post updated!");
      } else {
        await adminApi.createCorporateGirlie(editingItem);
        toast.success("Post created!");
      }
      setIsModalOpen(false);
      loadAllData(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save post");
    }
  };

  const handleDeleteCorporate = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    try {
      await adminApi.deleteCorporateGirlie(id);
      toast.success("Post deleted!");
      loadAllData(false);
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem.id) {
        await adminApi.updateEvent(editingItem.id, editingItem);
        toast.success("Event updated!");
      } else {
        await adminApi.createEvent(editingItem);
        toast.success("Event created!");
      }
      setIsModalOpen(false);
      loadAllData(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save event");
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    try {
      await adminApi.deleteEvent(id);
      toast.success("Event deleted!");
      loadAllData(false);
    } catch {
      toast.error("Failed to delete event");
    }
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem.id) {
        await adminApi.updateNote(editingItem.id, editingItem);
        toast.success("Author Note updated!");
      } else {
        await adminApi.createNote(editingItem);
        toast.success("Author Note created!");
      }
      setIsModalOpen(false);
      loadAllData(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save note");
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (!confirm("Delete this note?")) return;
    try {
      await adminApi.deleteNote(id);
      toast.success("Note deleted!");
      loadAllData(false);
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const handleSaveHomeReader = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem.id) {
        await adminApi.updateHomeReader(editingItem.id, editingItem);
        toast.success("Homepage Reader slot updated!");
      } else {
        await adminApi.createHomeReader(editingItem);
        toast.success("Homepage Reader slot created!");
      }
      setIsModalOpen(false);
      loadAllData(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save reader item");
    }
  };

  const handleDeleteHomeReader = async (id: number) => {
    if (!confirm("Delete this reader item?")) return;
    try {
      await adminApi.deleteHomeReader(id);
      toast.success("Reader item deleted!");
      loadAllData(false);
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const openNewModal = (type: TabType) => {
    const emptyContent = serialiseBlocks([{ id: uid(), type: "text", html: "" }]);
    if (type === "lessons") {
      setEditingItem({
        name: "",
        title: "",
        subtitle: "",
        excerpt: "",
        content: emptyContent,
        quote: "",
        quote_by: "",
        category: "Founder Story",
        date: "Jul 2026",
        read_time: "5 min read",
        published: true,
      });
    } else if (type === "stories") {
      setEditingItem({
        title: "",
        subtitle: "",
        excerpt: "",
        content: emptyContent,
        quote: "",
        quote_by: "",
        tag: "Ecosystem",
        date: "Coming soon",
        published: true,
      });
    } else if (type === "reality") {
      setEditingItem({
        title: "",
        description: "",
        tag: "Documentary",
        published: true,
      });
    } else if (type === "corporate") {
      setEditingItem({
        title: "",
        author: "Anonymous",
        excerpt: "",
        summary: "",
        substack_url: "",
        tag: "Career Growth",
        date: "Jul 2026",
        published: true,
      });
    } else if (type === "events") {
      setEditingItem({
        title: "",
        subtitle: "",
        author: "",
        body: "",
        content: emptyContent,
        highlights: "",
        tag: "Summit",
        date: "Jul 2026",
        location: "",
        published: true,
      });
    } else if (type === "notes") {
      setEditingItem({
        title: "",
        excerpt: "",
        content: "",
        date: "Jul 2026",
        published: true,
      });
    } else if (type === "home_reader") {
      setEditingItem({
        tab_id: 0,
        tag: "Startup News",
        title: "",
        body: "",
        date: "Sep 2026",
        source: "Unmasking Editorial",
        label: "Covered by Unmasking",
        sort_order: 1,
        published: true,
      });
    }
    setIsModalOpen(true);
  };

  const tabCounts: Record<TabType, number> = {
    lessons: lessons.length,
    stories: stories.length,
    reality: realitySeries.length,
    corporate: corporateItems.length,
    events: events.length,
    notes: notes.length,
    home_reader: homeReader.length,
    subscribers: subscribers.length,
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "lessons", label: "Entrepreneur Lessons" },
    { id: "stories", label: "Startup Stories" },
    { id: "reality", label: "Reality Series" },
    { id: "corporate", label: "Corporate Girlie" },
    { id: "events", label: "Event Documentaries" },
    { id: "notes", label: "Author Notes" },
    { id: "home_reader", label: "Home Reader" },
    { id: "subscribers", label: "Subscribers" },
  ];

  const CardFooter = ({ item, onEdit, onDelete }: { item: any; onEdit: () => void; onDelete: () => void }) => (
    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
      <span
        className={`inline-flex items-center gap-1 font-semibold ${
          item.published ? "text-emerald-400" : "text-amber-400"
        }`}
      >
        ● {item.published ? "Published" : "Draft"}
      </span>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" onClick={onEdit} className="text-xs">
          Edit
        </Button>
        <Button size="sm" variant="ghost" className="text-xs text-destructive hover:bg-destructive/10" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="container min-h-[80vh] flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full p-8 rounded-3xl border border-white/60 dark:border-white/10 shadow-2xl backdrop-blur-2xl space-y-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-primary">Direct Link Access Only</span>
            <h1 className="font-display text-2xl font-bold text-foreground">Admin Portal Access</h1>
            <p className="text-xs text-muted-foreground">Enter your admin security passkey to manage database content.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Admin Key</label>
              <Input
                type="password"
                required
                placeholder="Enter access key..."
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                className="bg-background"
                autoFocus
              />
            </div>
            {authError && <p className="text-xs text-destructive font-medium">{authError}</p>}
            <Button type="submit" className="w-full bg-primary text-primary-foreground font-semibold">
              Unlock Dashboard
            </Button>
          </form>
          <div className="pt-2 border-t border-border/40">
            <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Return to Unmasking Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container pt-16 pb-24 min-h-screen space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs uppercase tracking-wider text-primary font-semibold">
                Multi-Category Control Hub
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                  isConnected
                    ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                    : "bg-amber-950/60 text-amber-400 border-amber-800 animate-pulse"
                }`}
              >
                ● {isConnected ? "Live Real-Time Sync" : "Connecting..."}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleSeedDatabase} variant="outline" className="text-xs font-semibold border-border">
              Seed Initial Content
            </Button>
            {activeTab !== "subscribers" && (
              <Button onClick={() => openNewModal(activeTab)} className="text-xs font-semibold bg-primary text-primary-foreground">
                + Add Item
              </Button>
            )}
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
              Lock Session
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label} ({tabCounts[tab.id]})
            </button>
          ))}
        </div>

        {loading && <div className="py-12 text-center text-muted-foreground text-sm">Loading content...</div>}

        {/* TAB 1: ENTREPRENEUR LESSONS */}
        {!loading && activeTab === "lessons" && (
          <div className="grid md:grid-cols-2 gap-4">
            {lessons.length === 0 && <p className="text-muted-foreground text-sm italic col-span-2">No lessons yet. Click 'Seed Initial Content' or '+ Add Item'.</p>}
            {lessons.map((item) => (
              <div key={item.id || item.title} className="p-6 rounded-md bg-card border border-border flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-xs bg-muted text-foreground font-semibold">{item.category}</span>
                    <span className="text-xs text-muted-foreground">{item.date} • {item.read_time}</span>
                  </div>
                  <h3 className="text-lg font-bold mt-2 text-foreground">{item.title}</h3>
                  {item.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>}
                  <p className="text-xs text-primary font-semibold mt-2">By {item.name}</p>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.excerpt}</p>
                </div>
                <CardFooter item={item} onEdit={() => { setEditingItem({ ...item }); setIsModalOpen(true); }} onDelete={() => item.id && handleDeleteLesson(item.id)} />
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: STARTUP STORIES */}
        {!loading && activeTab === "stories" && (
          <div className="grid md:grid-cols-2 gap-4">
            {stories.length === 0 && <p className="text-muted-foreground text-sm italic col-span-2">No stories yet.</p>}
            {stories.map((item) => (
              <div key={item.id || item.title} className="p-6 rounded-md bg-card border border-border flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-xs bg-muted text-foreground font-semibold">{item.tag}</span>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <h3 className="text-lg font-bold mt-2 text-foreground">{item.title}</h3>
                  {item.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>}
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{item.excerpt}</p>
                </div>
                <CardFooter item={item} onEdit={() => { setEditingItem({ ...item }); setIsModalOpen(true); }} onDelete={() => item.id && handleDeleteStory(item.id)} />
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: REALITY SERIES */}
        {!loading && activeTab === "reality" && (
          <div className="grid md:grid-cols-2 gap-4">
            {realitySeries.length === 0 && <p className="text-muted-foreground text-sm italic col-span-2">No documentary series yet.</p>}
            {realitySeries.map((item) => (
              <div key={item.id || item.title} className="p-6 rounded-md bg-card border border-border flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-xs bg-muted text-foreground font-semibold">{item.tag}</span>
                    <span className="text-xs text-muted-foreground">{item.episodes?.length || 0} episode(s)</span>
                  </div>
                  <h3 className="text-lg font-bold mt-2 text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{item.description}</p>
                </div>
                <CardFooter item={item} onEdit={() => { setEditingItem({ ...item }); setIsModalOpen(true); }} onDelete={() => item.id && handleDeleteRealitySeries(item.id)} />
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: CORPORATE GIRLIE */}
        {!loading && activeTab === "corporate" && (
          <div className="grid md:grid-cols-2 gap-4">
            {corporateItems.length === 0 && <p className="text-muted-foreground text-sm italic col-span-2">No posts yet.</p>}
            {corporateItems.map((item) => (
              <div key={item.id || item.title} className="p-6 rounded-md bg-card border border-border flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-xs bg-muted text-foreground font-semibold">{item.tag}</span>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                  <p className="text-xs text-primary font-semibold mb-2">By {item.author}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.excerpt}</p>
                </div>
                <CardFooter item={item} onEdit={() => { setEditingItem({ ...item }); setIsModalOpen(true); }} onDelete={() => item.id && handleDeleteCorporate(item.id)} />
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: EVENT DOCUMENTARIES */}
        {!loading && activeTab === "events" && (
          <div className="grid md:grid-cols-2 gap-4">
            {events.length === 0 && <p className="text-muted-foreground text-sm italic col-span-2">No events yet.</p>}
            {events.map((item) => (
              <div key={item.id || item.title} className="p-6 rounded-md bg-card border border-border flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-xs bg-muted text-foreground font-semibold">{item.tag}</span>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <h3 className="text-lg font-bold mt-2 text-foreground">{item.title}</h3>
                  {item.location && <p className="text-xs text-muted-foreground mt-1">Location: {item.location}</p>}
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.body}</p>
                </div>
                <CardFooter item={item} onEdit={() => { setEditingItem({ ...item }); setIsModalOpen(true); }} onDelete={() => item.id && handleDeleteEvent(item.id)} />
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: AUTHOR NOTES & ESSAYS */}
        {!loading && activeTab === "notes" && (
          <div className="grid md:grid-cols-2 gap-4">
            {notes.length === 0 && <p className="text-muted-foreground text-sm italic col-span-2">No author notes yet.</p>}
            {notes.map((item) => (
              <div key={item.id || item.title} className="p-6 rounded-md bg-card border border-border flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-xs bg-muted text-foreground font-semibold">Essay</span>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <h3 className="text-lg font-bold mt-2 text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{item.excerpt}</p>
                </div>
                <CardFooter item={item} onEdit={() => { setEditingItem({ ...item }); setIsModalOpen(true); }} onDelete={() => item.id && handleDeleteNote(item.id)} />
              </div>
            ))}
          </div>
        )}

        {/* TAB 7: HOMEPAGE LIVE READER */}
        {!loading && activeTab === "home_reader" && (
          <div className="grid md:grid-cols-3 gap-4">
            {homeReader.length === 0 && <p className="text-muted-foreground text-sm italic col-span-3">No reader items yet. Click 'Seed Initial Content' or '+ Add Item'.</p>}
            {homeReader.map((item) => (
              <div key={item.id || item.title} className="p-6 rounded-md bg-card border border-border flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-xs bg-primary/20 text-primary font-semibold">
                      Tab {item.tab_id}: {["News", "Fact", "Update"][item.tab_id] || "Slot"}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <h3 className="text-base font-bold mt-2 text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{item.body}</p>
                  {item.source && <p className="text-[11px] text-muted-foreground/70 mt-2">Source: {item.source}</p>}
                </div>
                <CardFooter item={item} onEdit={() => { setEditingItem({ ...item }); setIsModalOpen(true); }} onDelete={() => item.id && handleDeleteHomeReader(item.id)} />
              </div>
            ))}
          </div>
        )}

        {/* TAB 8: SUBSCRIBERS */}
        {!loading && activeTab === "subscribers" && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Registered Subscribers ({subscribers.length})</h3>
            </div>
            {subscribers.length === 0 ? (
              <p className="text-muted-foreground text-sm italic">No subscribers yet.</p>
            ) : (
              <div className="divide-y divide-border/60">
                {subscribers.map((sub) => (
                  <div key={sub.id} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-foreground">{sub.email}</p>
                      {sub.name && <p className="text-xs text-muted-foreground">{sub.name}</p>}
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      Source: {sub.source}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FORM MODAL */}
        {isModalOpen && editingItem && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-md max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-foreground">
                {editingItem.id ? "Edit" : "Add"}{" "}
                {{
                  lessons: "Entrepreneur Lesson",
                  stories: "Startup Story",
                  reality: "Reality Series",
                  corporate: "Corporate Girlie Post",
                  events: "Event Documentary",
                  notes: "Author Note",
                  home_reader: "Homepage Reader Item",
                  subscribers: "Subscriber",
                }[activeTab]}
              </h3>

              <form
                onSubmit={(e) => {
                  if (activeTab === "lessons") handleSaveLesson(e);
                  else if (activeTab === "stories") handleSaveStory(e);
                  else if (activeTab === "reality") handleSaveRealitySeries(e);
                  else if (activeTab === "corporate") handleSaveCorporate(e);
                  else if (activeTab === "events") handleSaveEvent(e);
                  else if (activeTab === "notes") handleSaveNote(e);
                  else if (activeTab === "home_reader") handleSaveHomeReader(e);
                }}
                className="space-y-4 text-sm"
              >
                {/* Home Reader Specific Tab Selection */}
                {activeTab === "home_reader" && (
                  <div className="space-y-1">
                    <label className="font-semibold text-xs uppercase tracking-wider text-primary">Target Tab Slot</label>
                    <select
                      value={editingItem.tab_id ?? 0}
                      onChange={(e) => setEditingItem({ ...editingItem, tab_id: Number(e.target.value) })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <option value={0}>Tab 0: Startup News</option>
                      <option value={1}>Tab 1: Entrepreneurship Fact</option>
                      <option value={2}>Tab 2: Latest Update</option>
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-semibold text-xs uppercase tracking-wider text-primary">Title</label>
                  <Input
                    required
                    placeholder="Main headline"
                    value={editingItem.title || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="bg-background"
                  />
                </div>

                {activeTab !== "corporate" && activeTab !== "notes" && activeTab !== "home_reader" && activeTab !== "reality" && (
                  <div className="space-y-1">
                    <label className="font-semibold text-xs uppercase tracking-wider text-primary">Subtitle</label>
                    <Input
                      placeholder="Supporting deck"
                      value={editingItem.subtitle || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                )}

                {activeTab !== "notes" && activeTab !== "reality" && (
                  <div className="space-y-1">
                    <label className="font-semibold text-xs uppercase tracking-wider text-primary">Category / Tag</label>
                    <Input
                      value={activeTab === "lessons" ? editingItem.category || "" : editingItem.tag || ""}
                      onChange={(e) => {
                        if (activeTab === "lessons") setEditingItem({ ...editingItem, category: e.target.value });
                        else setEditingItem({ ...editingItem, tag: e.target.value });
                      }}
                      placeholder="e.g. Founder Story, Summit, Career Growth"
                      className="bg-background"
                    />
                  </div>
                )}

                {(activeTab === "lessons" || activeTab === "corporate" || activeTab === "events") && (
                  <div className="space-y-1">
                    <label className="font-semibold text-xs uppercase tracking-wider text-primary">Author Name</label>
                    <Input
                      placeholder="Author or interviewee name"
                      value={activeTab === "lessons" ? editingItem.name || "" : editingItem.author || ""}
                      onChange={(e) => {
                        if (activeTab === "lessons") setEditingItem({ ...editingItem, name: e.target.value });
                        else setEditingItem({ ...editingItem, author: e.target.value });
                      }}
                      className="bg-background"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-xs uppercase tracking-wider text-primary">Date</label>
                    <Input
                      value={editingItem.date || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                  {activeTab === "lessons" && (
                    <div className="space-y-1">
                      <label className="font-semibold text-xs uppercase tracking-wider text-primary">Read Time</label>
                      <Input
                        value={editingItem.read_time || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, read_time: e.target.value })}
                        placeholder="e.g. 8 min read"
                        className="bg-background"
                      />
                    </div>
                  )}
                  {activeTab === "home_reader" && (
                    <div className="space-y-1">
                      <label className="font-semibold text-xs uppercase tracking-wider text-primary">Source</label>
                      <Input
                        value={editingItem.source || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, source: e.target.value })}
                        placeholder="e.g. DPIIT Report 2026"
                        className="bg-background"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-xs uppercase tracking-wider text-primary">
                    {activeTab === "reality" ? "Description" : "Excerpt / Summary / Body"}
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Concise text..."
                    value={
                      activeTab === "events" || activeTab === "home_reader"
                        ? editingItem.body || ""
                        : activeTab === "reality"
                        ? editingItem.description || ""
                        : editingItem.excerpt || ""
                    }
                    onChange={(e) => {
                      if (activeTab === "events" || activeTab === "home_reader") setEditingItem({ ...editingItem, body: e.target.value });
                      else if (activeTab === "reality") setEditingItem({ ...editingItem, description: e.target.value });
                      else setEditingItem({ ...editingItem, excerpt: e.target.value });
                    }}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>

                {activeTab === "corporate" && (
                  <div className="space-y-1">
                    <label className="font-semibold text-xs uppercase tracking-wider text-primary">Substack Article URL</label>
                    <Input
                      placeholder="https://substack.com/@corporategirlieinstartup/... or article link"
                      value={editingItem.substack_url || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, substack_url: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                )}

                {(activeTab === "lessons" || activeTab === "stories") && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-xs uppercase tracking-wider text-primary">Featured Quote</label>
                      <Input
                        placeholder="Highlighted takeaway..."
                        value={editingItem.quote || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-xs uppercase tracking-wider text-primary">Quote By</label>
                      <Input
                        placeholder="Name of speaker"
                        value={editingItem.quote_by || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, quote_by: e.target.value })}
                        className="bg-background"
                      />
                    </div>
                  </div>
                )}

                {/* Content Block Editor for rich content */}
                {(activeTab === "lessons" || activeTab === "stories" || activeTab === "events") && (
                  <BlockEditor
                    key={editingItem.id ?? "new"}
                    value={editingItem.content || ""}
                    onChange={(v) => setEditingItem({ ...editingItem, content: v })}
                  />
                )}

                <div className="flex items-center gap-3 pt-2">
                  <label className="font-semibold text-xs uppercase tracking-wider text-primary">Status</label>
                  <button
                    type="button"
                    onClick={() => setEditingItem({ ...editingItem, published: !editingItem.published })}
                    className={`px-3 py-1 rounded text-xs font-semibold border transition-colors ${
                      editingItem.published ? "bg-emerald-950 text-emerald-400 border-emerald-800" : "bg-amber-950 text-amber-400 border-amber-800"
                    }`}
                  >
                    ● {editingItem.published ? "Published" : "Draft"}
                  </button>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-border">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary text-primary-foreground">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
