import json
from database import SessionLocal, engine
import models

def build_block_content(paragraphs, heading=None, quote=None, quote_author=None):
    blocks = []
    if heading:
        blocks.append({
            "id": "h1",
            "type": "text",
            "html": f"<h2>{heading}</h2>"
        })
    for i, p in enumerate(paragraphs):
        blocks.append({
            "id": f"p{i+1}",
            "type": "text",
            "html": f"<p>{p}</p>"
        })
    if quote:
        author_part = f" — <em>{quote_author}</em>" if quote_author else ""
        blocks.append({
            "id": "q1",
            "type": "text",
            "html": f"<blockquote class='border-l-2 border-primary pl-4 italic my-4 text-foreground/90'>{quote}{author_part}</blockquote>"
        })
    return json.dumps(blocks)

def seed_all_data(db, force_refresh=True):
    print("[*] Starting comprehensive database seed...")
    
    # Ensure tables exist
    models.Base.metadata.create_all(bind=engine)

    if force_refresh:
        # Clear existing entries to ensure complete clean test data
        db.query(models.RealityEpisode).delete()
        db.query(models.RealitySeries).delete()
        db.query(models.EntrepreneurLesson).delete()
        db.query(models.StartupStory).delete()
        db.query(models.CorporateGirlie).delete()
        db.query(models.EventDocumentary).delete()
        db.query(models.AuthorNote).delete()
        db.query(models.HomeReaderItem).delete()
        db.query(models.Registration).delete()
        db.commit()

    # 1. ENTREPRENEUR LESSONS
    lessons = [
        models.EntrepreneurLesson(
            slug="ravi-mehta-bootstrapped-to-10m",
            name="Ravi Mehta",
            title="From Bootstrapped Garage to a $10M Run-Rate",
            subtitle="The disciplined path of hyper-profitable customer focus",
            excerpt="Ravi never raised a single venture round. Here is how he built a profitable SaaS company by listening obsessively to fifty users.",
            content=build_block_content(
                paragraphs=[
                    "When Ravi Mehta left his senior engineering role at a tier-one tech conglomerate in 2021, everyone assumed he would raise a pre-seed round. Instead, he rented a tiny 100-sq-ft garage room in Indiranagar and gave himself six months of runway from personal savings.",
                    "His philosophy was deceptively simple: don't build software until you have manually solved the problem for ten people who are ready to write a cheque. He cold-emailed founders running mid-sized logistics operations and spent weeks sitting in warehouses watching their manual dispatch flows.",
                    "By month four, he had his first five paying accounts. By month eighteen, revenue crossed $1.2M with zero marketing budget. Ravi's story is a masterclass in extreme customer proximity and capital discipline."
                ],
                heading="The First Fifty Customers Are Found, Not Marketed To",
                quote="If you cannot charge for the clunky manual prototype, raising ten million dollars will only speed up how fast you build the wrong software.",
                quote_author="Ravi Mehta"
            ),
            quote="If you cannot charge for the clunky manual prototype, raising ten million dollars will only speed up how fast you build the wrong software.",
            quote_by="Ravi Mehta",
            image_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
            category="Founder Story",
            date="Apr 12, 2026",
            read_time="8 min read",
            published=True
        ),
        models.EntrepreneurLesson(
            slug="amira-sayed-rebuilding-after-failure",
            name="Amira Sayed",
            title="Rebuilding After a Public Failure",
            subtitle="Turning headline setbacks into foundational resilience",
            excerpt="Her first direct-to-consumer startup shut down on the front page of tech news. She opens up about what nobody tells you about coming back.",
            content=build_block_content(
                paragraphs=[
                    "The press loves the rise and the spectacular crash. When Amira Sayed's supply-chain startup entered liquidation after a sudden collapse of their primary banking partner, the post-mortems were everywhere.",
                    "What no one wrote about was the nine months of silent depression, paying vendor balances from personal savings, and the painful process of unlinking self-worth from valuation metrics.",
                    "Today, Amira leads a profitable infrastructure service serving over 200 consumer brands. In this candid discussion, she details the psychological armor and operational hygiene necessary to rebuild from scratch."
                ],
                heading="The Anatomy of Recovery",
                quote="Failure isn't poetic when you're living it. It's mundane, exhausting, and bureaucratic. But surviving it gives you a moat no competitor can copy.",
                quote_author="Amira Sayed"
            ),
            quote="Failure isn't poetic when you're living it. It's mundane, exhausting, and bureaucratic. But surviving it gives you a moat no competitor can copy.",
            quote_by="Amira Sayed",
            image_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
            category="Resilience",
            date="Apr 04, 2026",
            read_time="11 min read",
            published=True
        ),
        models.EntrepreneurLesson(
            slug="leo-park-design-as-moat",
            name="Leo Park",
            title="Why Design Is the Only Moat Left",
            subtitle="Crafting irresistible taste in an AI-saturated market",
            excerpt="A deep conversation with Leo on why product taste and emotional resonance, not sheer feature count, is the durable advantage of this decade.",
            content=build_block_content(
                paragraphs=[
                    "Now that foundation models allow any developer to ship a functional copy of your product over a single weekend, feature parity is commoditized. Code generation has made speed table stakes.",
                    "Leo Park argues that taste, typography, spatial hierarchy, and kinetic delight are the only reasons users fall in love with an application and defend it with their wallets.",
                    "We dive into how his team audits micro-interactions, eliminates friction, and turns utilitarian workflows into delightful daily rituals."
                ],
                heading="Software as Craft",
                quote="Software without taste feels like eating nutritional paste. It keeps you alive, but nobody dreams about it.",
                quote_author="Leo Park"
            ),
            quote="Software without taste feels like eating nutritional paste. It keeps you alive, but nobody dreams about it.",
            quote_by="Leo Park",
            image_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
            category="Product",
            date="Mar 28, 2026",
            read_time="9 min read",
            published=True
        ),
        models.EntrepreneurLesson(
            slug="priya-nair-the-hard-truth-of-unit-economics",
            name="Priya Nair",
            title="The Hard Truth of Unit Economics in Quick Commerce",
            subtitle="Why burning cash on CAC is a trap founders must escape",
            excerpt="Priya shares unvarnished data on customer acquisition costs, delivery margins, and why sustainable retention beats vanity growth every single time.",
            content=build_block_content(
                paragraphs=[
                    "When growth is subsidized by venture capital, founders often mistake discounts for customer love. Priya Nair breaks down why unit economics must be measured at the contribution margin level from Day 1.",
                    "She shares actual cohort analysis spreadsheets from her logistics venture, illustrating how cutting unviable customer segments tripled their bottom-line health in under four months."
                ],
                heading="Contribution Margin Over Vanity GMV",
                quote="If you lose ten cents on every delivery, no amount of volume will make you profitable.",
                quote_author="Priya Nair"
            ),
            quote="If you lose ten cents on every delivery, no amount of volume will make you profitable.",
            quote_by="Priya Nair",
            image_url="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
            category="Finance",
            date="Mar 15, 2026",
            read_time="7 min read",
            published=True
        )
    ]
    db.add_all(lessons)

    # 2. STARTUP STORIES
    stories = [
        models.StartupStory(
            slug="incubators-vs-accelerators",
            title="Incubators vs Accelerators: Who Actually Helps",
            subtitle="Filtering ecosystem signal from calendar-filling noise",
            excerpt="The startup ecosystem is full of programs that sound identical on paper. Here is how to tell which one will move your company, and which one will just fill your calendar.",
            content=build_block_content(
                paragraphs=[
                    "Ecosystem programmes market themselves with promises of tier-one networks and guaranteed follow-on rounds. But founders quickly discover that many programs exist primarily to justify grant subsidies or charge management fees.",
                    "We surveyed 120 early-stage founders to determine the real net promoter score of top accelerators across Southeast Asia and India. Here are the benchmarks you must evaluate before signing a 7% equity SAFE."
                ]
            ),
            quote="Equity given away in year one is the most expensive money you will ever spend.",
            quote_by="Unmasking Editorial",
            tag="Ecosystem",
            date="May 20, 2026",
            published=True
        ),
        models.StartupStory(
            slug="investor-map-first-time-founders",
            title="The Investor Map Nobody Draws for First-Time Founders",
            subtitle="Navigating angel networks, syndicates, and quiet cheques",
            excerpt="Angels, micro-VCs, family offices, and the quiet cheques that never hit TechCrunch. Know the room before you walk into it.",
            content=build_block_content(
                paragraphs=[
                    "Most fundraising guides tell you how to structure a 10-slide deck. Very few explain the political power dynamics between lead angels, syndicate syndicators, and institutional scout funds.",
                    "This comprehensive guide details the real motivations behind term sheets and how to avoid dilution pitfalls."
                ]
            ),
            tag="Capital",
            date="May 14, 2026",
            published=True
        ),
        models.StartupStory(
            slug="communities-operators-and-network",
            title="Communities, Operators, and the People Who Open Doors",
            subtitle="The human foundation underneath every venture",
            excerpt="Before you write code, learn who already built the network. The startup ecosystem is a people business wearing a tech costume.",
            content=build_block_content(
                paragraphs=[
                    "Cold DMs rarely convert. The strongest founder partnerships, early hires, and advisor relationships originate in high-trust operator circles where people share uncensored post-mortems over chai.",
                    "Here is a curated directory of the quiet Slack groups, WhatsApp communities, and curated salons that actually matter."
                ]
            ),
            tag="Network",
            date="May 01, 2026",
            published=True
        ),
        models.StartupStory(
            slug="navigating-down-rounds-with-dignity",
            title="Navigating Down Rounds and Cap Table Recaps",
            subtitle="How to survive valuation resets without losing your team",
            excerpt="Valuations have cooled from peak euphoria. What happens when your next round has to be flat or down? Here is the legal and psychological playbook.",
            content=build_block_content(
                paragraphs=[
                    "Taking a down round is painful for founder ego, but it doesn't have to be fatal for company momentum. We break down pay-to-play clauses, liquidation preferences, and employee option pool refreshes."
                ]
            ),
            tag="Governance",
            date="Apr 22, 2026",
            published=True
        )
    ]
    db.add_all(stories)

    # 3. REALITY SERIES & EPISODES
    s1 = models.RealitySeries(
        slug="obstacles",
        title="Obstacles",
        description="The hard parts no pitch deck mentions: cash crunches, co-founder fractures, market timing, and the quiet days when quitting feels rational.",
        tag="Documentary",
        published=True
    )
    s2 = models.RealitySeries(
        slug="resilience",
        title="Resilience",
        description="How founders come back after shutdowns, public failure, burnout, and the version of themselves that almost didn't try again.",
        tag="Documentary",
        published=True
    )
    s3 = models.RealitySeries(
        slug="bootstrap-chronicles",
        title="Bootstrap Chronicles",
        description="Building without venture capital safety nets. Founders who rejected external equity and built profitable cash-flow machines.",
        tag="Docuseries",
        published=True
    )
    db.add_all([s1, s2, s3])
    db.commit()
    db.refresh(s1)
    db.refresh(s2)
    db.refresh(s3)

    episodes = [
        models.RealityEpisode(series_id=s1.id, episode_number=1, title="Episode 1: When the Money Runs Out First", excerpt="Runway is a story founders tell themselves. This episode sits with founders whose bank balance hit zero, and examines what happened the next morning.", video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ", date="Available now", published=True),
        models.RealityEpisode(series_id=s1.id, episode_number=2, title="Episode 2: The Co-Founder Conversation Nobody Wants", excerpt="Equity, ego, and the split that almost never happens cleanly. Founders talk about the fracture before it hit the cap table.", video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ", date="Available now", published=True),
        models.RealityEpisode(series_id=s1.id, episode_number=3, title="Episode 3: Building Into a Market That Isn't Ready", excerpt="Being too early looks indistinguishable from being wrong. This episode explores stubbornness and knowing when to pivot.", video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ", date="Available now", published=True),
        
        models.RealityEpisode(series_id=s2.id, episode_number=1, title="Episode 1: After the Shutdown", excerpt="The entity is dissolved, but identity remains entangled. Founders discuss the first twelve months after closing the doors.", video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ", date="Available now", published=True),
        models.RealityEpisode(series_id=s2.id, episode_number=2, title="Episode 2: Burnout Doesn't Announce Itself", excerpt="It looks like grit until your health suddenly gives out. A frank documentary on the cost of building without a stop condition.", video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ", date="Available now", published=True),
        models.RealityEpisode(series_id=s2.id, episode_number=3, title="Episode 3: Trying Again, On Purpose", excerpt="The second venture is never a sequel. Founders who returned slower, sharper, and less interested in performing hustle.", video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ", date="Available now", published=True),
        
        models.RealityEpisode(series_id=s3.id, episode_number=1, title="Episode 1: Profitability Over Prestige", excerpt="Saying no to venture term sheets and relying exclusively on customer revenue to fuel month-over-month growth.", video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ", date="Available now", published=True),
        models.RealityEpisode(series_id=s3.id, episode_number=2, title="Episode 2: The Freedom Dividend", excerpt="Retaining 100% ownership and building software on your own terms without board meetings or artificial exit timelines.", video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ", date="Available now", published=True)
    ]
    db.add_all(episodes)

    # 4. CORPORATE GIRLIE
    corporate = [
        models.CorporateGirlie(
            slug="navigating-office-politics-with-grace",
            title="Navigating Office Politics Without Losing Yourself",
            author="Sarah Jenkins",
            excerpt="Corporate games are real, but you do not have to compromise your integrity to win. Here is the strategic playbook for high-performers.",
            content=build_block_content(
                paragraphs=[
                    "When you enter corporate tech, you assume merit is the sole currency. But influence and alliances determine who gets resourcing and credit.",
                    "Here is how to advocate for your work, manage upwards without sycophancy, and build cross-functional leverage."
                ]
            ),
            tag="Career Growth",
            date="Jun 01, 2026",
            substack_url="https://unmasking.substack.com",
            published=True
        ),
        models.CorporateGirlie(
            slug="the-art-of-saying-no-at-work",
            title="The Art of Saying No (Without Hurting Your Career)",
            author="Elena Rostova",
            excerpt="Overcommitted and burnt out? How to establish clear boundaries with managers and teammates while maintaining your reputation as a top performer.",
            content=build_block_content(
                paragraphs=[
                    "Saying yes to everything isn't loyalty; it's a fast track to mediocre deliverables and acute exhaustion.",
                    "Learn how to push back with data, trade-off proposals, and strategic calendar protection."
                ]
            ),
            tag="Workplace Culture",
            date="May 24, 2026",
            substack_url="https://unmasking.substack.com",
            published=True
        ),
        models.CorporateGirlie(
            slug="the-promotion-memo-that-actually-works",
            title="The Promotion Memo That Actually Works",
            author="Kavya Sen",
            excerpt="Why waiting for annual reviews is a mistake. How to document your business impact quarterly and force calibration decisions.",
            content=build_block_content(
                paragraphs=[
                    "Promotion committees don't reward effort; they reward demonstrable business impact with measurable metrics.",
                    "Download the self-advocacy template our readers have used to secure Level 5+ promotions."
                ]
            ),
            tag="Negotiation",
            date="May 10, 2026",
            substack_url="https://unmasking.substack.com",
            published=True
        )
    ]
    db.add_all(corporate)

    # 5. EVENT DOCUMENTARIES
    events = [
        models.EventDocumentary(
            title="The Startup Summit 2026: A Front Row Seat",
            subtitle="Three days of unfiltered founder conversations and late-night critiques",
            author="Editorial Team",
            body="Three days of unfiltered founder conversations, late-night pitch critiques, and the raw energy of builders who refuse to quit. This is what it felt like to be there.",
            content=build_block_content(
                paragraphs=[
                    "From quiet hallway conversations to unscripted stage arguments between angel investors and growth leaders, Summit 2026 brought together over 1,500 builders from across the subcontinent.",
                    "We captured 40+ hours of footage and transcribed the most candid reflections on current fundraising trends, generative tech stacks, and team retention."
                ]
            ),
            highlights="40+ speakers, 1,500 attendees, 12 candid founder fireside debates.",
            tag="Summit",
            date="May 18, 2026",
            location="Bangalore International Centre",
            video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            published=True
        ),
        models.EventDocumentary(
            title="Mental Health in Tech: The Panel Nobody Expected",
            subtitle="Vulnerability on stage: the unseen psychological toll of building",
            author="Editorial Team",
            body="A quiet, deeply emotional session at a loud conference. Founders spoke openly about depression, panic attacks, and the isolation of leadership.",
            content=build_block_content(
                paragraphs=[
                    "In an industry obsessed with relentless optimism, this panel was a breath of fresh air. Four founders recounted their darkest operational months and how professional counseling saved their lives and companies."
                ]
            ),
            highlights="Standing-room only attendance; launch of the Founder Well-Being Coalition.",
            tag="Panel",
            date="May 05, 2026",
            location="Koramangala Tech Hub",
            video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            published=True
        ),
        models.EventDocumentary(
            title="Women Founders Meetup: Bangalore Edition",
            subtitle="Decades of collective grit in an intimate, closed-door room",
            author="Editorial Team",
            body="An intimate evening of storytelling, vulnerability, and unexpected alliances. The room held decades of collective grit and strategic advice.",
            content=build_block_content(
                paragraphs=[
                    "Fifty women founders gathered on a rooftop in Indiranagar to unpack fundraising biases, hire strategies, and scaling operational moats in traditional industries."
                ]
            ),
            highlights="Co-investment pledges signed on the spot; community mentorship network established.",
            tag="Meetup",
            date="Apr 22, 2026",
            location="Indiranagar Rooftop",
            video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            published=True
        )
    ]
    db.add_all(events)

    # 6. AUTHOR NOTES & ESSAYS
    notes = [
        models.AuthorNote(
            slug="on-truth-as-a-brand-strategy",
            title="On Truth as a Brand Strategy",
            excerpt="Most founders edit their stories until nothing real is left. The ones who win in the next decade will do the opposite.",
            content="Building in public has turned into performing in public. When every update sounds like a pre-written press release, authenticity becomes an unfair advantage. Customers and talent don't connect with perfection; they connect with honest ambition and transparency.",
            date="April 2026",
            published=True
        ),
        models.AuthorNote(
            slug="why-i-started-unmasking",
            title="Why I Started Unmasking",
            excerpt="The internet is loud with advice and quiet on truth. I wanted to build a sanctuary where founders could speak without a PR script.",
            content="Every founder I spoke with offline had a completely different story than the one they shared on LinkedIn. Unmasking is the bridge between the two. We document the scars, the doubts, and the small uncelebrated victories that define true entrepreneurship.",
            date="March 2026",
            published=True
        ),
        models.AuthorNote(
            slug="writing-is-thinking-out-loud",
            title="Writing Is Thinking, Out Loud",
            excerpt="If you cannot write what you are building in two clear paragraphs, you do not yet understand what you are building.",
            content="Clear writing is the ultimate debugging tool for your venture roadmap. When you force yourself to put ideas into sentences, logical leaps and wishful assumptions have nowhere to hide.",
            date="February 2026",
            published=True
        ),
        models.AuthorNote(
            slug="the-loneliness-of-the-first-ten-hires",
            title="The Loneliness of the First Ten Hires",
            excerpt="Transitioning from builder to manager is the first existential crisis every founder encounters.",
            content="When you hire your first ten employees, your job fundamentally shifts from shipping features to designing the context in which other people make decisions.",
            date="January 2026",
            published=True
        )
    ]
    db.add_all(notes)

    # 7. HOMEPAGE LIVE READER ITEMS (tabs 0, 1, 2)
    home_reader = [
        models.HomeReaderItem(
            tab_id=0,
            tag="Startup News",
            date="Sep 2026",
            title="India's Startup Ecosystem Crosses 1.4 Lakh Registered Startups",
            body="The Department for Promotion of Industry and Internal Trade (DPIIT) confirmed that India now has over 1.4 lakh DPIIT-recognised startups, making it the third-largest startup ecosystem globally. Tier-2 and Tier-3 cities are driving the next wave of deeptech growth.",
            source="DPIIT Annual Report, 2026",
            label="Covered by Unmasking",
            sort_order=1,
            published=True
        ),
        models.HomeReaderItem(
            tab_id=0,
            tag="Capital Markets",
            date="Aug 2026",
            title="Domestic Indian Family Offices Double Early-Stage Deployments",
            body="Family offices across Mumbai, Bangalore, and Delhi have allocated upwards of $2.4B into tech ventures this fiscal year, reducing founder reliance on foreign institutional capital.",
            source="Venture Intelligence Q3 Briefing",
            label="Exclusive Analysis",
            sort_order=2,
            published=True
        ),
        models.HomeReaderItem(
            tab_id=1,
            tag="Entrepreneurship Fact",
            date="2025 Data",
            title="72% of Founders Report Serious Mental Health Challenges",
            body="A landmark study found that nearly three in four startup founders experience depression, anxiety, or burnout at some point in their journey. The isolation of building remains the industry's loudest open secret.",
            source="UCSF Founder Mental Health Study",
            label="Fact verified by Unmasking",
            sort_order=1,
            published=True
        ),
        models.HomeReaderItem(
            tab_id=1,
            tag="Unit Economics",
            date="Industry Benchmark",
            title="Bootstrapped SaaS Companies Retain 2.4x Higher Net Margins",
            body="Analysis of 450 recurring-revenue businesses shows that companies relying on organic inbound and customer-funded growth reach profitability three years faster than peer VC cohorts.",
            source="SaaS Capital Benchmarks",
            label="Verified Metric",
            sort_order=2,
            published=True
        ),
        models.HomeReaderItem(
            tab_id=2,
            tag="Latest Update",
            date="Sep 27, 2026",
            title="Unmasking Launches SEO, AEO and GEO Services for Startups",
            body="Unmasking is now working directly with startups, D2C brands, and SaaS companies to deliver full-scope modern search visibility. This covers traditional SEO, AI answer engine optimisation (AEO), and generative engine positioning (GEO).",
            source="Unmasking Editorial Team",
            label="From Unmasking",
            sort_order=1,
            published=True
        ),
        models.HomeReaderItem(
            tab_id=2,
            tag="Platform News",
            date="Oct 2026",
            title="Unmasking Podcast & Reality Video Hub Officially Enters Beta",
            body="Our video documentary series 'Obstacles' and 'Resilience' are now streaming in 4K with accompanying interactive interview transcripts and downloadable founder toolkits.",
            source="Unmasking Production Studio",
            label="New Feature",
            sort_order=2,
            published=True
        )
    ]
    db.add_all(home_reader)

    # 8. SUBSCRIBERS / REGISTRATIONS
    subscribers = [
        models.Registration(name="Aarav Sharma", email="aarav.sharma@foundershub.io", source="subscribe"),
        models.Registration(name="Meera Krishnan", email="meera.k@venturecapital.in", source="subscribe"),
        models.Registration(name="Rohan Gupta", email="rohan@bootstrappers.dev", source="book"),
        models.Registration(name="Ananya Roy", email="ananya.roy@fintechscale.com", source="subscribe"),
        models.Registration(name="Vikramaditya Rao", email="vikram@deeptechindia.org", source="book"),
        models.Registration(name="Tanvi Deshmukh", email="tanvi@d2cgrowth.co", source="subscribe"),
        models.Registration(name="Kabir Malhotra", email="kabir.m@seedfund.vc", source="subscribe"),
        models.Registration(name="Sneha Patil", email="sneha.patil@saasbuilders.net", source="book")
    ]
    db.add_all(subscribers)

    db.commit()
    print("[*] Successfully seeded all sections with comprehensive, production-ready data!")

if __name__ == "__main__":
    session = SessionLocal()
    try:
        seed_all_data(session, force_refresh=True)
    finally:
        session.close()
