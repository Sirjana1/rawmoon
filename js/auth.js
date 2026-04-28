// Auth helper — updates nav button based on login state
async function updateAuthButton() {
  const { data: { user } } = await supabase.auth.getUser();
  const btn = document.getElementById('authBtn');
  if (!btn) return;
  if (user) {
    btn.textContent = 'My Account';
    btn.href = 'upload.html';
  } else {
    btn.textContent = 'Sign In';
    btn.href = 'login.html';
  }
}

updateAuthButton();