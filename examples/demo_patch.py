"""
DEMO 2 — Paste this for AUTO-PATCH mode
Shows: Multiple logic bugs that Nemotron reasons through and fixes
"""

def calculate_discount(price, discount_percent, user_type):
    """Apply discount to a price based on user type."""
    # Bug 1: no validation — negative price accepted
    # Bug 2: discount can exceed 100 — negative price result
    discount = price * discount_percent / 100
    final = price - discount

    if user_type == "premium":
        final = final * 0.9   # Extra 10% for premium

    # Bug 3: should return final, but returns discount by mistake
    return discount


def find_duplicates(items):
    """Return list of duplicate values in a list."""
    seen = []
    duplicates = []

    for item in items:
        if item in seen:
            # Bug 4: appends duplicate every time it's seen again
            # e.g. [1,1,1] gives duplicates=[1,1] instead of [1]
            duplicates.append(item)
        seen.append(item)

    return duplicates


def paginate(data, page, page_size):
    """Return one page of data."""
    # Bug 5: off-by-one — page 1 skips the first item
    start = page * page_size
    end = start + page_size
    return data[start:end]


def merge_configs(base, override):
    """Merge two config dicts, override wins on conflict."""
    result = base         # Bug 6: mutates base dict, not a copy
    for key, value in override.items():
        result[key] = value
    return result


class RateLimiter:
    """Allow max N calls per user per minute."""

    def __init__(self, max_calls):
        self.max_calls = max_calls
        self.calls = {}   # Bug 7: shared class state if used as class var

    def is_allowed(self, user_id):
        import time
        now = time.time()
        history = self.calls.get(user_id, [])
        # Bug 8: never cleans old entries outside 60s window
        recent = [t for t in history if now - t < 60]
        if len(recent) >= self.max_calls:
            return False
        recent.append(now)
        self.calls[user_id] = recent
        return True

    def reset(self, user_id):
        # Bug 9: KeyError crash if user_id not in calls
        del self.calls[user_id]
