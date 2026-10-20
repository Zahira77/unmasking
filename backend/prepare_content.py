from database import SessionLocal
import models

def prepare():
    db = SessionLocal()
    try:
        # 1. Set dummy items to Draft (published = False) so website displays 'Coming Soon, Stay Tuned!'
        db.query(models.EntrepreneurLesson).update({"published": False})
        db.query(models.StartupStory).update({"published": False})
        db.query(models.CorporateGirlie).update({"published": False})
        db.query(models.EventDocumentary).update({"published": False})

        # 2. Organize Home Reader items: exactly 3 slots for Tab 0, Tab 1, Tab 2
        items = db.query(models.HomeReaderItem).order_by(models.HomeReaderItem.tab_id.asc(), models.HomeReaderItem.id.asc()).all()
        seen_tabs = set()
        for item in items:
            if item.tab_id in seen_tabs or item.tab_id > 2:
                db.delete(item)
            else:
                seen_tabs.add(item.tab_id)
                item.published = True

        existing_tabs = {it.tab_id for it in db.query(models.HomeReaderItem).all()}
        if 0 not in existing_tabs:
            db.add(models.HomeReaderItem(
                tab_id=0,
                tag="Startup News",
                date="Today",
                title="India's Startup Ecosystem Crosses 1.4 Lakh Registered Startups",
                body="The Department for Promotion of Industry and Internal Trade (DPIIT) confirmed that India now has over 1.4 lakh DPIIT-recognised startups.",
                source="DPIIT Report",
                label="Covered by Unmasking",
                sort_order=0,
                published=True
            ))
        if 1 not in existing_tabs:
            db.add(models.HomeReaderItem(
                tab_id=1,
                tag="Entrepreneurship Fact",
                date="Today",
                title="72% of Founders Report Serious Mental Health Challenges",
                body="A landmark study found that nearly three in four startup founders experience depression, anxiety, or burnout at some point in their journey.",
                source="Founder Mental Health Study",
                label="Fact verified by Unmasking",
                sort_order=1,
                published=True
            ))
        if 2 not in existing_tabs:
            db.add(models.HomeReaderItem(
                tab_id=2,
                tag="Latest Update",
                date="Today",
                title="Unmasking Launches SEO, AEO and GEO Services for Startups",
                body="Unmasking is now working directly with startups, D2C brands, and SaaS companies to deliver full-scope modern search visibility.",
                source="Unmasking Editorial Team",
                label="From Unmasking",
                sort_order=2,
                published=True
            ))

        db.commit()
        print("Database successfully configured!")
        print("Published count - Lessons:", db.query(models.EntrepreneurLesson).filter(models.EntrepreneurLesson.published == True).count())
        print("Published count - Stories:", db.query(models.StartupStory).filter(models.StartupStory.published == True).count())
        print("Published count - Corporate:", db.query(models.CorporateGirlie).filter(models.CorporateGirlie.published == True).count())
        print("Published count - Events:", db.query(models.EventDocumentary).filter(models.EventDocumentary.published == True).count())
        print("Home Reader slots:", [(it.id, it.tab_id, it.title) for it in db.query(models.HomeReaderItem).all()])
    finally:
        db.close()

if __name__ == "__main__":
    prepare()
