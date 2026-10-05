class TripError(Exception):
    def __init__(self, detail, field=None, status=400):
        super().__init__(detail)
        self.field = field
        self.status = status
