"""
DEMO 3 — Paste this for TEST GENERATOR mode
Clean, working code that Nemotron writes comprehensive tests for
"""

class BankAccount:
    """A simple bank account with deposit, withdraw, and transfer."""

    def __init__(self, owner: str, balance: float = 0.0):
        if not owner or not owner.strip():
            raise ValueError("Owner name cannot be empty")
        if balance < 0:
            raise ValueError("Initial balance cannot be negative")
        self.owner = owner.strip()
        self._balance = round(balance, 2)
        self._transactions = []

    @property
    def balance(self) -> float:
        return self._balance

    def deposit(self, amount: float) -> float:
        """Deposit a positive amount. Returns new balance."""
        if amount <= 0:
            raise ValueError(f"Deposit amount must be positive, got {amount}")
        self._balance = round(self._balance + amount, 2)
        self._transactions.append(("deposit", amount))
        return self._balance

    def withdraw(self, amount: float) -> float:
        """Withdraw if funds available. Returns new balance."""
        if amount <= 0:
            raise ValueError(f"Withdrawal amount must be positive, got {amount}")
        if amount > self._balance:
            raise InsufficientFundsError(
                f"Cannot withdraw {amount}, balance is {self._balance}"
            )
        self._balance = round(self._balance - amount, 2)
        self._transactions.append(("withdrawal", amount))
        return self._balance

    def transfer(self, target: "BankAccount", amount: float) -> None:
        """Transfer amount from this account to target account."""
        if target is self:
            raise ValueError("Cannot transfer to the same account")
        self.withdraw(amount)       # raises if insufficient
        target.deposit(amount)
        self._transactions.append(("transfer_out", amount))
        target._transactions.append(("transfer_in", amount))

    def statement(self) -> list:
        """Return list of (type, amount) transaction tuples."""
        return list(self._transactions)


class InsufficientFundsError(Exception):
    pass
