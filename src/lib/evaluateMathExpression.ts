const TOKEN_PATTERN = /\s*(\d+(?:\.\d+)?|[()+\-*/])/y

type Token = string

const tokenize = (input: string): Token[] | null => {
  const tokens: Token[] = []
  TOKEN_PATTERN.lastIndex = 0
  let lastIndex = 0

  while (lastIndex < input.length) {
    TOKEN_PATTERN.lastIndex = lastIndex
    const match = TOKEN_PATTERN.exec(input)
    if (!match) return null
    tokens.push(match[1])
    lastIndex = TOKEN_PATTERN.lastIndex
  }

  return tokens
}

class Parser {
  private position = 0

  constructor(private readonly tokens: Token[]) {}

  parse(): number | null {
    if (this.tokens.length === 0) return null
    const result = this.parseExpression()
    if (result === null || this.position !== this.tokens.length) return null
    return result
  }

  private parseExpression(): number | null {
    let value = this.parseTerm()
    if (value === null) return null

    while (this.peek() === '+' || this.peek() === '-') {
      const operator = this.consume()
      const rhs = this.parseTerm()
      if (rhs === null) return null
      value = operator === '+' ? value + rhs : value - rhs
    }

    return value
  }

  private parseTerm(): number | null {
    let value = this.parseFactor()
    if (value === null) return null

    while (this.peek() === '*' || this.peek() === '/') {
      const operator = this.consume()
      const rhs = this.parseFactor()
      if (rhs === null) return null
      if (operator === '/') {
        if (rhs === 0) return null
        value = value / rhs
      } else {
        value = value * rhs
      }
    }

    return value
  }

  private parseFactor(): number | null {
    const token = this.peek()

    if (token === '-') {
      this.consume()
      const value = this.parseFactor()
      return value === null ? null : -value
    }

    if (token === '(') {
      this.consume()
      const value = this.parseExpression()
      if (value === null || this.peek() !== ')') return null
      this.consume()
      return value
    }

    if (token !== undefined && /^\d+(\.\d+)?$/.test(token)) {
      this.consume()
      return Number(token)
    }

    return null
  }

  private peek(): Token | undefined {
    return this.tokens[this.position]
  }

  private consume(): Token {
    return this.tokens[this.position++]
  }
}

export const evaluateMathExpression = (input: string): number | null => {
  const trimmed = input.trim()
  if (!trimmed) return null

  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed)
  }

  const tokens = tokenize(trimmed)
  if (!tokens) return null

  const result = new Parser(tokens).parse()
  if (result === null || !Number.isFinite(result)) return null

  return Math.round(result * 100) / 100
}
