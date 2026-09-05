"""
Derived from openjustice-in/ecourts (GPL-3.0-or-later).
Modifications: Overrode solve() to allow manual injection of answers instead of running local OCR, and added fetch_image_bytes().
"""
from ecourts.captcha import Captcha, CaptchaError

class RelayCaptcha(Captcha):
    def __init__(self, session=None, retry=100):
        super().__init__(session, retry)
        self._manual_answer = None

    def fetch_image_bytes(self) -> bytes:
        """Fetches the CAPTCHA image and returns raw bytes, preserving the session cookie."""
        if self.session is None:
            raise ValueError("Session object is required")
        
        res = self.session.get(self.URL, headers={
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0"
        })
        
        if res.status_code != 200:
            raise CaptchaError(f"Failed to fetch CAPTCHA image: {res.status_code}")
            
        return res.content

    def set_answer(self, text: str):
        """Injects the user's typed CAPTCHA response."""
        self._manual_answer = text

    def solve(self):
        """Overrides the original solve to return the manually set answer instead of automated OCR."""
        if self._manual_answer is None:
            raise CaptchaError("No answer has been set for this CAPTCHA yet.")
        return self._manual_answer
