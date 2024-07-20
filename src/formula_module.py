import re
import math
import operator

class Cell:
    def __init__(self, value=None):
        self.value = value
        self.formula = None

    def set_formula(self, formula):
        self.formula = formula
        self.value = None

class Spreadsheet:
    def __init__(self):
        self.cells = {}

    def get_cell(self, cell_ref):
        if cell_ref not in self.cells:
            self.cells[cell_ref] = Cell()
        return self.cells[cell_ref]

    def set_cell_value(self, cell_ref, value):
        cell = self.get_cell(cell_ref)
        cell.value = value
        cell.formula = None

    def set_cell_formula(self, cell_ref, formula):
        cell = self.get_cell(cell_ref)
        cell.set_formula(formula)

class Formula:
    def __init__(self, formula_string, spreadsheet):
        self.formula_string = formula_string
        self.spreadsheet = spreadsheet

    def evaluate(self):
        try:
            tokens = self.tokenize(self.formula_string)
            return self.parse_expression(tokens)
        except Exception as e:
            return f"#ERROR: {str(e)}"

    def tokenize(self, formula):
        token_specification = [
            ('NUMBER',   r'\d+(\.\d*)?'),
            ('CELL',     r'[A-Z]+\d+'),
            ('FUNCTION', r'[A-Z]+(?=\()'),
            ('OP',       r'[+\-*/^]'),
            ('LPAREN',   r'\('),
            ('RPAREN',   r'\)'),
            ('COMMA',    r','),
            ('WHITESPACE', r'\s+'),
        ]
        tok_regex = '|'.join('(?P<%s>%s)' % pair for pair in token_specification)
        return [match.groupdict() for match in re.finditer(tok_regex, formula)]

    def parse_expression(self, tokens):
        values = []
        operators = []

        for token in tokens:
            if token['NUMBER']:
                values.append(float(token['NUMBER']))
            elif token['CELL']:
                cell_value = self.get_cell_value(token['CELL'])
                values.append(cell_value)
            elif token['FUNCTION']:
                func_name = token['FUNCTION']
                args = self.parse_function_args(tokens)
                result = self.apply_function(func_name, args)
                values.append(result)
            elif token['OP']:
                while operators and self.precedence(operators[-1]) >= self.precedence(token['OP']):
                    self.apply_operator(operators.pop(), values)
                operators.append(token['OP'])
            elif token['LPAREN']:
                operators.append(token['LPAREN'])
            elif token['RPAREN']:
                while operators[-1] != '(':
                    self.apply_operator(operators.pop(), values)
                operators.pop()  # Remove the '('

        while operators:
            self.apply_operator(operators.pop(), values)

        return values[0]

    def parse_function_args(self, tokens):
        args = []
        current_arg = []
        paren_count = 0
        while tokens:
            token = tokens.pop(0)
            if token['LPAREN']:
                paren_count += 1
            elif token['RPAREN']:
                paren_count -= 1
                if paren_count == 0:
                    args.append(self.parse_expression(current_arg))
                    break
            elif token['COMMA'] and paren_count == 1:
                args.append(self.parse_expression(current_arg))
                current_arg = []
            else:
                current_arg.append(token)
        return args

    def apply_function(self, func_name, args):
        if func_name in functions:
            return functions[func_name](*args)
        else:
            raise ValueError(f"Unknown function: {func_name}")

    def apply_operator(self, op, values):
        right = values.pop()
        left = values.pop()
        values.append(operations[op](left, right))

    def precedence(self, op):
        if op in {'+', '-'}:
            return 1
        elif op in {'*', '/'}:
            return 2
        elif op == '^':
            return 3
        return 0

    def get_cell_value(self, cell_ref):
        cell = self.spreadsheet.get_cell(cell_ref)
        if cell.formula:
            return Formula(cell.formula, self.spreadsheet).evaluate()
        elif cell.value is not None:
            return cell.value
        else:
            return 0  # Default value for empty cells

def parse_cell_reference(cell_ref):
    match = re.match(r'([A-Z]+)(\d+)', cell_ref)
    if match:
        col, row = match.groups()
        return col, int(row)
    raise ValueError(f"Invalid cell reference: {cell_ref}")

def column_index_to_string(index):
    result = ""
    while index > 0:
        index -= 1
        result = chr(65 + (index % 26)) + result
        index //= 26
    return result

# Basic mathematical operations
operations = {
    '+': operator.add,
    '-': operator.sub,
    '*': operator.mul,
    '/': operator.truediv,
    '^': operator.pow,
}

# Basic mathematical functions
functions = {
    'SUM': sum,
    'AVERAGE': lambda *args: sum(args) / len(args),
    'MIN': min,
    'MAX': max,
    'ABS': abs,
    'ROUND': round,
    'SQRT': math.sqrt,
    'LN': math.log,
    'LOG10': math.log10,
    'SIN': math.sin,
    'COS': math.cos,
    'TAN': math.tan,
}

# Error handling
class SpreadsheetError(Exception):
    pass

class DivisionByZeroError(SpreadsheetError):
    pass

class InvalidReferenceError(SpreadsheetError):
    pass

class InvalidFormulaError(SpreadsheetError):
    pass

# Wrap division operation to handle division by zero
def safe_div(a, b):
    if b == 0:
        raise DivisionByZeroError("Division by zero")
    return a / b

operations['/'] = safe_div
