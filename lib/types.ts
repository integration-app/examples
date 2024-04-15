export interface Scenario {
  name: string
  description: string
  slug: string
  flowKey: string
  disabled?: boolean
}

export interface Company {
  id: number
  name: string
  domain: string
  pushedInto: { [key: string]: any }
}

export interface Turtle {
  name: string
  badge_color: string
}
