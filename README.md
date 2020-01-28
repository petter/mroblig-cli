# mroblig-cli

This is a command line interface to [Mr. Oblig](https://sws.ifi.uio.no/mroblig/) for testing your obligs in the course [IN3060/IN4060](https://www.uio.no/studier/emner/matnat/ifi/IN3060/index-eng.html).

## Usage

```bash
npx mroblig-cli OBLIGNR FILENAME
```

You can also install it globally if you prefer that:

```bash
npm i -g mroblig-cli
mroblig-cli OBLIGNR FILENAME
```

### Example

```bash
npx mroblig-cli 1 simpsons.ttl
```

Make sure your node version is up to date.

Note: This CLI is simply doing a form submission and parsing the HTML output, so it might break if Mr. Oblig changes!
