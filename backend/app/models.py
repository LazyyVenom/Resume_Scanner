class Item:
    def __init__(self, name: str, description: str, price: float, tax: float = None):
        self.name = name
        self.description = description
        self.price = price
        self.tax = tax

    def total_price(self):
        if self.tax:
            return self.price + self.tax
        return self.price