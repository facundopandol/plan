def test_create_fixed_obligation(client):
    response = client.post(
        "/api/v1/obligations",
        json={
            "name": "Alquiler",
            "amount": 350000,
            "category_name": "Alquiler",
            "frequency": "Mensual",
            "active": True,
            "paid": False,
            "is_fixed": True,
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["name"] == "Alquiler"
    assert float(body["amount"]) == 350000
    assert body["is_fixed"] is True


def test_list_fixed_obligations(client):
    client.post(
        "/api/v1/obligations",
        json={
            "name": "Alquiler",
            "amount": 1000,
            "category_name": "Alquiler",
            "frequency": "Mensual",
            "active": True,
            "paid": False,
            "is_fixed": True,
        },
    )
    client.post(
        "/api/v1/obligations",
        json={
            "name": "Internet",
            "amount": 2000,
            "category_name": "Servicios",
            "frequency": "Mensual",
            "active": True,
            "paid": False,
            "is_fixed": True,
        },
    )

    response = client.get("/api/v1/obligations", params={"is_fixed": True})
    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 2
    names = {item["name"] for item in body["items"]}
    assert names == {"Alquiler", "Internet"}


def test_reject_non_positive_amount(client):
    response = client.post(
        "/api/v1/obligations",
        json={
            "name": "Inválida",
            "amount": 0,
            "is_fixed": True,
            "active": True,
        },
    )
    assert response.status_code == 422
