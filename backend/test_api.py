import sys
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_full_api():
    print("\n--- 1. Testing Database Seed ---")
    res = client.post("/api/admin/seed")
    assert res.status_code == 200, f"Seed failed: {res.text}"
    print(" Seed response:", res.json())

    print("\n--- 2. Testing Lessons ---")
    res = client.get("/api/lessons")
    assert res.status_code == 200
    lessons = res.json()
    assert len(lessons) > 0, "No lessons found after seed"
    print(f" Loaded {len(lessons)} lessons.")

    first_slug = lessons[0]["slug"]
    res_slug = client.get(f"/api/lessons/by-slug/{first_slug}")
    assert res_slug.status_code == 200
    print(f" Successfully fetched lesson by slug '{first_slug}': {res_slug.json()['title']}")

    # Create a test lesson
    new_lesson = {
        "title": "Real-Time Test Lesson",
        "subtitle": "Testing Live Synchronization",
        "name": "Alex Vance",
        "excerpt": "A short test excerpt for real-time validation.",
        "category": "Testing",
        "date": "Oct 2026",
        "read_time": "3 min read",
        "published": True
    }
    create_res = client.post("/api/lessons", json=new_lesson)
    assert create_res.status_code == 200
    created = create_res.json()
    created_id = created["id"]
    print(f" Created test lesson with id {created_id}.")

    # Update test lesson
    update_res = client.put(f"/api/lessons/{created_id}", json={**new_lesson, "title": "Updated Test Lesson"})
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Updated Test Lesson"
    print(" Successfully updated test lesson.")

    # Delete test lesson
    del_res = client.delete(f"/api/lessons/{created_id}")
    assert del_res.status_code == 200
    print(" Successfully deleted test lesson.")

    print("\n--- 3. Testing Author Notes ---")
    res_notes = client.get("/api/notes")
    assert res_notes.status_code == 200
    notes = res_notes.json()
    assert len(notes) > 0, "No notes found after seed"
    print(f" Loaded {len(notes)} author notes.")

    print("\n--- 4. Testing Home Reader Items ---")
    res_reader = client.get("/api/home-reader")
    assert res_reader.status_code == 200
    reader_items = res_reader.json()
    assert len(reader_items) >= 3, "Expected at least 3 home reader slots"
    print(f" Loaded {len(reader_items)} home reader slots.")

    print("\n--- 5. Testing Reality Series ---")
    res_series = client.get("/api/reality-series")
    assert res_series.status_code == 200
    series = res_series.json()
    assert len(series) > 0
    print(f" Loaded {len(series)} reality series.")

    print("\n--- 6. Testing WebSocket Connection ---")
    with client.websocket_connect("/api/ws/content") as websocket:
        websocket.send_text("ping")
        resp = websocket.receive_text()
        assert resp == "pong"
        print(" WebSocket connected and replied 'pong' to ping!")

    print("\n ALL BACKEND TESTS PASSED SUCCESSFULLY! ")

if __name__ == "__main__":
    test_full_api()
