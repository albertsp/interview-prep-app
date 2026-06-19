import json


class TestRegister:
    def test_register_success(self, client, db):
        payload = {"name": "New User", "email": "new@example.com", "password": "password123"}
        resp = client.post("/auth/register", json=payload)
        assert resp.status_code == 201
        data = resp.get_json()
        assert "Usuario creado correctamente" in data["success"]

    def test_register_duplicate_email(self, client, registered_user):
        payload = {"name": "Another User", "email": registered_user["email"], "password": "anotherpass1"}
        resp = client.post("/auth/register", json=payload)
        assert resp.status_code == 409
        data = resp.get_json()
        assert "ya esta registrado" in data["error"]

    def test_register_missing_fields(self, client, db):
        resp = client.post("/auth/register", json={"name": "", "email": "", "password": ""})
        assert resp.status_code == 400
        data = resp.get_json()
        assert "vacios" in data["error"]

    def test_register_invalid_email(self, client, db):
        payload = {"name": "User", "email": "not-an-email", "password": "password123"}
        resp = client.post("/auth/register", json=payload)
        assert resp.status_code == 400

    def test_register_short_password(self, client, db):
        payload = {"name": "User", "email": "user@example.com", "password": "1234567"}
        resp = client.post("/auth/register", json=payload)
        assert resp.status_code == 400

    def test_register_non_json_body(self, client, db):
        resp = client.post("/auth/register", data="not json", content_type="text/plain")
        assert resp.status_code in (400, 415)


class TestLogin:
    def test_login_success(self, client, registered_user):
        payload = {"email": registered_user["email"], "password": registered_user["password"]}
        resp = client.post("/auth/login", json=payload)
        assert resp.status_code == 200
        data = resp.get_json()
        assert data["name"] == registered_user["name"]
        assert data["token"] is not None
        assert len(data["token"]) > 0
        assert "access_token_cookie" in resp.headers.get("Set-Cookie", "")

    def test_login_wrong_password(self, client, registered_user):
        payload = {"email": registered_user["email"], "password": "wrongpassword1"}
        resp = client.post("/auth/login", json=payload)
        assert resp.status_code == 400
        assert "Credenciales incorrectas" in resp.get_json()["error"]

    def test_login_nonexistent_user(self, client, db):
        payload = {"email": "noone@example.com", "password": "password123"}
        resp = client.post("/auth/login", json=payload)
        assert resp.status_code == 400

    def test_login_oauth_user_null_password(self, client, db):
        from app.models.user import User
        user = User(name="OAuth User", email="oauth@example.com")
        db.session.add(user)
        db.session.commit()

        payload = {"email": "oauth@example.com", "password": "anypassword"}
        resp = client.post("/auth/login", json=payload)
        assert resp.status_code == 400
        assert "Credenciales incorrectas" in resp.get_json()["error"]

    def test_login_missing_fields(self, client, db):
        resp = client.post("/auth/login", json={"email": "", "password": ""})
        assert resp.status_code == 400

    def test_login_non_json(self, client, db):
        resp = client.post("/auth/login", data="not json", content_type="text/plain")
        assert resp.status_code in (400, 415)


class TestLogout:
    def test_logout_success(self, client):
        resp = client.post("/auth/logout")
        assert resp.status_code == 200
        assert "access_token_cookie" in resp.headers.get("Set-Cookie", "")
        assert "" in resp.headers.get("Set-Cookie", "").split("access_token_cookie=")[1].split(";")[0]


class TestProtectedEndpoints:
    def test_get_profile_without_token(self, client):
        resp = client.get("/me/profile")
        assert resp.status_code == 401

    def test_get_profile_with_token(self, client, auth_headers):
        resp = client.get("/me/profile", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.get_json()
        assert data["name"] == "Test User"

    def test_get_stats_without_token(self, client):
        resp = client.get("/me/stats")
        assert resp.status_code == 401

    def test_get_stats_with_token(self, client, auth_headers):
        resp = client.get("/me/stats", headers=auth_headers)
        assert resp.status_code == 200

    def test_update_profile(self, client, auth_headers):
        resp = client.patch("/me/profile", json={"name": "Updated Name"}, headers=auth_headers)
        assert resp.status_code == 200
        data = resp.get_json()
        assert data["name"] == "Updated Name"

    def test_update_profile_empty_name(self, client, auth_headers):
        resp = client.patch("/me/profile", json={"name": ""}, headers=auth_headers)
        assert resp.status_code == 400
