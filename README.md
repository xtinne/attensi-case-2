# Attensi: Technical Case - Frontend Developer

Willy Wonka’s Chocolate Factory wants its trainers to build training courses themselves instead of emailing a spreadsheet to a very tired Oompa-Loompa. Your task is to build a small course editor: Wonka’s Course Builder. The trainers know chocolate, not code, so the interface should be obvious enough to use between shifts and forgiving enough that nobody is afraid of breaking something. This is a frontend task, with a free choice of stack and TypeScript preferred, planned for 2–3 hours and kept under 5.

## Requirements

### Course

- A course is an ordered sequence of steps.
- Each step holds content of one type: text, an image, or a multiple choice question.

### Step Content

- Pick the type of a step and fill in its content.
- A multiple choice step has a question, some options, and one option marked correct.

### Step Management

- Add a step.
- Edit a step.
- Reorder steps.
- Delete a step.

### Scope

- No backend is needed. Keeping everything in memory is fine.
- One file or a full project is acceptable.
- For images, a URL or a local file is fine.
- The look and feel can belong in Wonka’s factory. Both the functionality and the visuals should get real attention.

## Running the project

Install dependencies and start the development server:

```sh
npm install
npm run dev
```

The page opens with a short example course, one step of each type. Everything lives in memory, so refreshing resets it.

## How I used AI

I used Claude Code for the implementation. Svelte is still fairly new to me, so it helped me work faster and explained the things I wasn’t familiar with. I built the project step by step, so I could confirm what was being built and make sure the code stayed clean and simple.

For the design, I used Claude Design and went through a few rounds until I had a design I was happy with.

I kept most of the implementation and the design direction, and changed things where I disagreed, such as how switching step types works, keeping the delete confirmation, and how the progress looks.
