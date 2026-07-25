def test_create_income(client):
    response = client.post(
        "/api/v1/incomes",
        json={
            "name": "Sueldo",
            "description": "Sueldo mensual",
            "income_type": "Sueldo",
            "amount": 1200000,
            "date": "2026-07-01",
            "is_plan_item": False,
            "recurring": False,
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["income_type"] == "Sueldo"
    assert float(body["amount"]) == 1200000
    assert body["date"] == "2026-07-01"


def test_update_and_delete_income(client):
    created = client.post(
        "/api/v1/incomes",
        json={
            "name": "Bono",
            "description": "Bono trimestral",
            "income_type": "Bono",
            "amount": 100000,
            "date": "2026-07-15",
            "is_plan_item": False,
            "recurring": False,
        },
    ).json()

    updated = client.put(
        f"/api/v1/incomes/{created['id']}",
        json={
            "name": "Bono",
            "description": "Bono actualizado",
            "income_type": "Bono",
            "amount": 150000,
            "date": "2026-07-15",
            "is_plan_item": False,
            "recurring": False,
        },
    )
    assert updated.status_code == 200
    assert float(updated.json()["amount"]) == 150000

    deleted = client.delete(f"/api/v1/incomes/{created['id']}")
    assert deleted.status_code == 200

    listing = client.get("/api/v1/incomes")
    assert listing.status_code == 200
    assert listing.json()["total"] == 0
