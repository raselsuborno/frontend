# UI Component Usage Examples

## Button

```jsx
import { Button } from "@/components/ui";

// Primary button
<Button variant="primary" size="md">
  Get Started
</Button>

// Secondary button
<Button variant="secondary">
  Learn More
</Button>

// Ghost button
<Button variant="ghost">
  Cancel
</Button>

// Destructive button
<Button variant="destructive">
  Delete Account
</Button>

// Loading state
<Button variant="primary" loading>
  Saving...
</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With icon
<Button variant="primary">
  <ArrowRight size={16} />
  Next Step
</Button>
```

## Card

```jsx
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui";

<Card>
  <CardHeader>
    <h3 className="text-xl font-semibold">Card Title</h3>
    <p className="text-sm text-[var(--ce-muted)]">Card subtitle</p>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button variant="primary">Action</Button>
  </CardFooter>
</Card>

// Simple card without header/footer
<Card>
  <div className="p-6">
    <p>Simple card content</p>
  </div>
</Card>
```

## Input

```jsx
import { Input, Textarea } from "@/components/ui";
import { Mail, Lock, Search } from "lucide-react";

// Basic input
<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
/>

// Input with icon
<Input
  label="Search"
  icon={<Search size={16} />}
  placeholder="Search..."
/>

// Input with error
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
/>

// Input with helper text
<Input
  label="Username"
  helperText="Choose a unique username"
/>

// Textarea
<Textarea
  label="Description"
  placeholder="Enter description..."
  rows={4}
/>
```

## Badge

```jsx
import { Badge } from "@/components/ui";

// Status variants
<Badge variant="pending">Pending</Badge>
<Badge variant="approved">Approved</Badge>
<Badge variant="cancelled">Cancelled</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>

// Default badge
<Badge>New</Badge>

// In table/list
<div className="flex items-center gap-2">
  <span>Order #123</span>
  <Badge variant="approved">Approved</Badge>
</div>
```

## Container

```jsx
import { Container } from "@/components/ui";

<Container>
  <h1>Page Content</h1>
  <p>This content is constrained to max-width 1280px</p>
</Container>

// With custom padding override
<Container className="px-8">
  Custom padding
</Container>
```

## Section

```jsx
import { Section } from "@/components/ui";

// Medium spacing (default)
<Section>
  <h2>Section Title</h2>
  <p>Content here</p>
</Section>

// Different sizes
<Section size="sm">
  Small spacing section
</Section>

<Section size="md">
  Medium spacing section
</Section>

<Section size="lg">
  Large spacing section
</Section>

<Section size="xl">
  Extra large spacing section
</Section>

// Combined with Container
<Section>
  <Container>
    <h2>Centered Section</h2>
    <p>Content with container</p>
  </Container>
</Section>
```

## Combined Example

```jsx
import { Container, Section, Card, CardHeader, CardContent, Button, Input, Badge } from "@/components/ui";
import { Mail, ArrowRight } from "lucide-react";

function ExamplePage() {
  return (
    <Section>
      <Container>
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Contact Us</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Email"
                type="email"
                icon={<Mail size={16} />}
                placeholder="your@email.com"
              />
              <Button variant="primary" className="w-full">
                Send Message
                <ArrowRight size={16} />
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Status</h3>
                <Badge variant="approved">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p>Your account is in good standing.</p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
```

