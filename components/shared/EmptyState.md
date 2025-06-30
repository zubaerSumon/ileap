# EmptyState Component

A reusable component for displaying beautiful empty states across the application.

## Usage

```tsx
import EmptyState from "@/components/shared/EmptyState";
import { Search, Users, BookOpen } from "lucide-react";

// Basic usage
<EmptyState
  icon={Search}
  title="No results found"
  description="Try adjusting your search criteria to find what you're looking for."
/>

// With action button
<EmptyState
  icon={Users}
  title="No volunteers found"
  description="Start by creating your first volunteer opportunity."
  actionLabel="Create Opportunity"
  onAction={() => router.push("/opportunities/create")}
/>

// Card variant
<EmptyState
  icon={BookOpen}
  title="No enrolled opportunities"
  description="You haven't been enrolled in any opportunities yet."
  actionLabel="Find Opportunities"
  onAction={() => router.push("/opportunities")}
  variant="card"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `LucideIcon` | - | Icon component to display |
| `title` | `string` | - | Main title text |
| `description` | `string` | - | Description text below title |
| `actionLabel` | `string` | - | Text for the action button |
| `onAction` | `() => void` | - | Function called when action button is clicked |
| `className` | `string` | - | Additional CSS classes |
| `iconClassName` | `string` | - | Additional CSS classes for the icon |
| `showAction` | `boolean` | `true` | Whether to show the action button |
| `variant` | `"default" \| "minimal" \| "card"` | `"default"` | Visual variant of the component |

## Variants

### Default
Standard empty state with medium padding and centered layout.

### Minimal
Compact version with less padding, suitable for smaller containers.

### Card
Card-style variant with background, border, and shadow for prominent display.

## Examples

### Volunteer Dashboard Empty States

```tsx
// Enrolled opportunities
<EmptyState
  icon={BookOpen}
  title="No enrolled opportunities yet"
  description="You haven't been enrolled in any opportunities yet. Start exploring and applying to opportunities that interest you."
  actionLabel="Find Opportunities"
  onAction={() => router.push("/volunteer/opportunity/find")}
  variant="card"
/>

// Recent applications
<EmptyState
  icon={FileText}
  title="No pending applications"
  description="You don't have any pending applications at the moment. Keep applying to opportunities to see them here."
  actionLabel="Browse Opportunities"
  onAction={() => router.push("/volunteer/opportunity/find")}
  variant="card"
/>

// Mentor assignments
<EmptyState
  icon={GraduationCap}
  title="No mentor assignments"
  description="You haven't been assigned as a mentor for any opportunities yet. Organizations will assign you when they need mentorship support."
  actionLabel="Explore Opportunities"
  onAction={() => router.push("/volunteer/opportunity/find")}
  variant="card"
/>
```

### Search Results

```tsx
// No search results
<EmptyState
  icon={Search}
  title="No opportunities found"
  description="We couldn't find any opportunities matching your criteria. Try adjusting your filters or search terms."
  variant="default"
  showAction={false}
/>

// No volunteers found
<EmptyState
  icon={Users}
  title="No volunteers found"
  description="Try adjusting your search criteria to find more volunteers that match your requirements."
  variant="default"
  showAction={false}
/>
```

## Styling

The component uses Tailwind CSS classes and can be customized with:

- `className` for the main container
- `iconClassName` for the icon styling
- Built-in responsive design
- Consistent spacing and typography
- Hover effects on action buttons

## Best Practices

1. **Use appropriate icons** that match the context
2. **Write clear, actionable descriptions** that help users understand what to do next
3. **Provide action buttons** when there's a clear next step
4. **Choose the right variant** based on the container and importance
5. **Keep descriptions concise** but informative
6. **Use consistent messaging** across similar empty states 