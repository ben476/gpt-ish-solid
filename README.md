# GPT-ish - Frontend

Perplexity-based ChatGPT detector! It uses a reverse-engineered copy of Meta's LLaMA library/model to find the probabilities of LLaMA generating the same tokens in the text. Or as the app describes it:

> When you ask an AI to write something for you, a neural network takes in
> the previous text (if any) and then, for every possible token (think of
> them as parts of a word), generates the probability of that particular
> token coming next. It then picks the most\* probable token and does this
> process again until your whole text is generated.
>
> The idea that the AI will always pick one of the most likely tokens is
> the basis for GPT-ish. By running a modified version of a GPT-like
> text generator, we can get the probability distributions for each token
> in the text and allow us to check if they're all just the most likely
> choices (like what an AI would do) or if there's more human-like
> variation.
>
> \*Actually, a technique called temperature sampling picks some less
> likely tokens at times to make your text more interesting.

## Usage

```bash
$ npm install # or pnpm install or yarn install
```

## Available Scripts

In the project directory, you can run:

### `npm dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)
