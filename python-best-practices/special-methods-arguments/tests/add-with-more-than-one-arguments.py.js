class GFG:
  
    def __init__(self, val):
        self.val = val
          
    def __add__(self, val2, val3):
        return GFG(self.val + val2.val)