"""
DEMO 4 — Paste this for CODE AUDIT mode
Shows: Performance issues, dead code, poor naming, anti-patterns
"""

import time

# Global mutable state — anti-pattern
data_list = []
counter = 0

def do_stuff(l, x):
    """Process data."""
    # O(n²) when O(n) is possible — use set lookup instead
    result = []
    for i in range(len(l)):
        found = False
        for j in range(len(l)):
            if l[j] == x and i != j:
                found = True
        if found:
            result.append(l[i])
    return result

def get_info(d, k, k2, k3):
    """Get nested config value."""
    # Brittle: KeyError on any missing key, no defaults
    return d[k][k2][k3]

def process(items):
    temp = []
    for i in items:
        temp.append(i)       # Useless copy — just use list(items)
    
    output = []
    for i in range(0, len(temp), 1):   # step=1 is default, redundant
        val = temp[i]
        if val == None:       # Should use `is None`
            continue
        if val != val:        # Dead code: NaN check, never true for non-float
            pass
        output.append(val * 2)
    
    return output

class DataProcessor:
    
    def __init__(self):
        self.cache = {}
    
    def expensive_compute(self, key):
        """Compute result — result cached but cache never expires."""
        if key in self.cache:
            return self.cache[key]
        
        time.sleep(0.1)   # Simulated I/O — blocks the thread
        result = sum(range(10000))
        self.cache[key] = result   # Cache grows forever — memory leak
        return result
    
    # Dead method — never called anywhere
    def _legacy_format(self, data):
        output = ""
        for item in data:
            output = output + str(item) + ","   # String concat in loop — O(n²)
        return output[:-1]
    
    def run_all(self, keys):
        results = []
        for k in keys:
            r = self.expensive_compute(k)
            results.append(r)
        return results   # Could be a list comprehension
