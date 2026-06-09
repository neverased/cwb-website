# WojciechBajer.com Source Code

This is the source code for the personal website located at [www.wojciechbajer.com](https://wojciechbajer.com).

## Description

This repository contains the code for my personal website, which serves as my online portfolio and blog.

## Installation

**Prerequisites:**

Please ensure that you have the following installed on your machine:

- Node.js 26
- pnpm 11.5.2

**Steps:**

1. Clone the repository:

    ```bash
    git clone https://github.com/wojciechbajer/wojciechbajer.com.git
    ```

2. Navigate to the project directory:

    ```bash
    cd wojciechbajer.com
    ```

3. Install the required dependencies:

    ```bash
    pnpm install
    ```

4. Start the development server:

    ```bash
    pnpm dev
    ```

The website should now be accessible at `http://localhost:3000`.

## Usage

This website is a personal portfolio and blog, where I share my projects, experiences, and writings.

## Docker runtime

The production container targets a Next.js standalone deployment on Node.js 26 with pnpm 11. The image expects `next.config.js` to emit `output: "standalone"` and starts the generated server with `node server.js`.

Build the image:

```bash
docker build -t cwb-website:local .
```

Run it locally:

```bash
docker run --rm -p 3000:3000 cwb-website:local
```

Or use Compose:

```bash
docker compose up --build
```

Runtime environment is injected through container environment variables. The image sets `HOSTNAME=0.0.0.0`, `PORT=3000`, `NODE_ENV=production`, `NEXT_TELEMETRY_DISABLED=1`, and `CONTACT_STORAGE_DIR=/app/storage/contact` by default.

The contact form is handled by Next.js route handlers under `/api/contact`. Configure these variables in production:

- `CONTACT_FORM_SECRET`: stable signing secret for contact challenges
- `CONTACT_STORAGE_DIR`: writable directory for rate-limit state and quarantined submissions
- `CONTACT_RECIPIENT`: destination mailbox, default `mail@wojciechbajer.com`
- `CONTACT_FROM`: sender address, default `mail@wojciechbajer.com`
- `SMTP_HOST`: SMTP server hostname
- `SMTP_PORT`: SMTP server port, default `587`
- `SMTP_SECURE`: set `true` for implicit TLS on port `465`
- `SMTP_USER` / `SMTP_PASSWORD`: SMTP auth credentials when required

Useful checks:

```bash
pnpm test:contact
pnpm build
docker build -t cwb-website:local .
docker compose config
```

## Contributions

While I appreciate your interest, I am not currently accepting pull requests for this project.

## License

This project is licensed under the MIT License. See the LICENSE.md file for details.

## Contact

Feel free to contact me at [mail@wojciechbajer.com] for any questions or feedback.
