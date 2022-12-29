import React from 'react';

import { json } from '@remix-run/node';

import { useLoaderData } from '@remix-run/react';
import Turnstile from 'react-turnstile';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';

export async function loader({ request }: LoaderArgs) {
  return json({ API_KEY: process.env.CF_TURNSTILE_KEY });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const get_form_response = formData.get('cf-turnstile-response');
  const form = new URLSearchParams();
  form.append('secret', process.env.CF_TURNSTILE_SECRET!);
  form.append('response', get_form_response as string);

  const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });

  const outcome = await result.json();
  console.log('🚀 ~ file: login.tsx:27 ~ action ~ outcome', outcome);
  return null;
}

function Login() {
  const turnstile_api_key = useLoaderData<typeof loader>();

  return (
    <div>
      <form method="POST">
        <h2>Dummy Login Demo</h2>
        <Turnstile sitekey={turnstile_api_key.API_KEY!} onVerify={() => null} responseField={true} />
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}

export default Login;
