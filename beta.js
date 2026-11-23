const form = document.querySelector('#beta-form');
const submit = form.querySelector('button[type="submit"]');
const status = document.querySelector('#signup-status');
const guide = document.querySelector('#install-guide');

submit.disabled = false;
form.addEventListener('submit', async event => {
  event.preventDefault();
  submit.disabled = true;
  form.setAttribute('aria-busy', 'true');
  status.textContent = 'Sending your request…';
  const values = new FormData(form);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(form.dataset.endpoint, {
      method: 'POST',
      credentials: 'omit',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        fullName: values.get('fullName'),
        email: values.get('email'),
        consent: values.get('consent') === 'on',
        website: values.get('website'),
      }),
      signal: controller.signal,
    });
    const result = await response.json();
    if (!response.ok || !result.accepted) {
      status.textContent = result.error ?? 'Couldn’t submit right now. Please try again.';
      return;
    }
    form.reset();
    form.hidden = true;
    guide.hidden = false;
    guide.querySelector('h2').focus();
  } catch {
    status.textContent = 'Couldn’t submit right now. Please try again.';
  } finally {
    clearTimeout(timeout);
    form.removeAttribute('aria-busy');
    submit.disabled = false;
  }
});
