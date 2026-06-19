import bcrypt
from app.models.user import User
from app.models.oauth_account import OAuthAccount


class TestUserModel:
    def test_create_user(self, db, app):
        with app.app_context():
            user = User(name="Test User", email="test@example.com")
            hashed = bcrypt.hashpw(b"password123", bcrypt.gensalt(12)).decode("utf-8")
            user.password = hashed
            db.session.add(user)
            db.session.commit()

            saved = User.query.filter_by(email="test@example.com").first()
            assert saved is not None
            assert saved.name == "Test User"
            assert saved.total_xp == 0
            assert saved.level == 1

    def test_user_null_password(self, db, app):
        with app.app_context():
            user = User(name="OAuth User", email="oauth@example.com")
            db.session.add(user)
            db.session.commit()

            saved = User.query.filter_by(email="oauth@example.com").first()
            assert saved.password is None

    def test_user_unique_email(self, db, app):
        with app.app_context():
            user1 = User(name="User 1", email="same@example.com")
            db.session.add(user1)
            db.session.commit()

            user2 = User(name="User 2", email="same@example.com")
            db.session.add(user2)
            import pytest
            from sqlalchemy.exc import IntegrityError
            with pytest.raises(IntegrityError):
                db.session.commit()

    def test_user_defaults(self, db, app):
        with app.app_context():
            user = User(name="Default User", email="default@example.com")
            db.session.add(user)
            db.session.commit()

            assert user.total_xp == 0
            assert user.level == 1
            assert user.oauth_accounts.count() == 0


class TestOAuthAccountModel:
    def test_create_oauth_account(self, db, app):
        with app.app_context():
            user = User(name="OAuth User", email="oauth-user@example.com")
            db.session.add(user)
            db.session.flush()

            link = OAuthAccount(
                user_id=user.user_id,
                provider="google",
                provider_user_id="google_123",
            )
            db.session.add(link)
            db.session.commit()

            saved = OAuthAccount.query.filter_by(
                provider="google", provider_user_id="google_123"
            ).first()
            assert saved is not None
            assert saved.user_id == user.user_id

    def test_unique_provider_user_id(self, db, app):
        with app.app_context():
            user1 = User(name="User 1", email="u1@example.com")
            user2 = User(name="User 2", email="u2@example.com")
            db.session.add_all([user1, user2])
            db.session.flush()

            link1 = OAuthAccount(
                user_id=user1.user_id, provider="google", provider_user_id="same_id"
            )
            db.session.add(link1)
            db.session.commit()

            link2 = OAuthAccount(
                user_id=user2.user_id, provider="google", provider_user_id="same_id"
            )
            db.session.add(link2)
            import pytest
            from sqlalchemy.exc import IntegrityError
            with pytest.raises(IntegrityError):
                db.session.commit()

    def test_same_id_different_providers(self, db, app):
        with app.app_context():
            user = User(name="User", email="user@example.com")
            db.session.add(user)
            db.session.flush()

            link1 = OAuthAccount(
                user_id=user.user_id, provider="google", provider_user_id="same_id"
            )
            link2 = OAuthAccount(
                user_id=user.user_id, provider="github", provider_user_id="same_id"
            )
            db.session.add_all([link1, link2])
            db.session.commit()

            assert OAuthAccount.query.filter_by(provider="google").count() == 1
            assert OAuthAccount.query.filter_by(provider="github").count() == 1

    def test_user_relationship(self, db, app):
        with app.app_context():
            user = User(name="Test", email="test@example.com")
            db.session.add(user)
            db.session.flush()

            link = OAuthAccount(
                user_id=user.user_id, provider="google", provider_user_id="g_id"
            )
            db.session.add(link)
            db.session.commit()

            assert link.user.name == "Test"
            assert user.oauth_accounts.count() == 1
