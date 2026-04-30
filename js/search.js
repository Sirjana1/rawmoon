// Search papers from Supabase
async function searchPapers() {
  const subject = document.getElementById('searchInput').value.trim();
  const university = document.getElementById('filterUniversity').value;
  const faculty = document.getElementById('filterFaculty').value;
  const year = document.getElementById('filterYear').value;
  const semester = document.getElementById('filterSemester').value;

  const loading = document.getElementById('loading');
  const papersList = document.getElementById('papersList');
  const emptyState = document.getElementById('emptyState');
  const resultsCount = document.getElementById('resultsCount');

  loading.style.display = 'block';
  papersList.innerHTML = '';
  emptyState.style.display = 'none';

  let query = supabase
    .from('papers')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (subject) query = query.ilike('subject', `%${subject}%`);
  if (university) query = query.eq('university', university);
  if (faculty) query = query.eq('faculty', faculty);
  if (year) query = query.eq('year', year);
  if (semester) query = query.eq('semester', semester);

  const { data, error } = await query;
  loading.style.display = 'none';

  if (error || !data || data.length === 0) {
    emptyState.style.display = 'block';
    resultsCount.textContent = '0 papers found';
    return;
  }

  resultsCount.textContent = `${data.length} paper${data.length !== 1 ? 's' : ''} found`;

  data.forEach(paper => {
    const card = document.createElement('div');
    card.className = 'paper-card';
    card.innerHTML = `
      <div class="paper-info">
        <div class="paper-title">${paper.subject} — ${paper.faculty}</div>
        <div class="paper-meta">
          <span class="tag university">${paper.university}</span>
          <span class="tag year">Year ${paper.year}</span>
          <span class="tag semester">${paper.semester}</span>
          <span class="tag">${new Date(paper.created_at).getFullYear()}</span>
        </div>
      </div>
      <div class="paper-actions">
        <a href="${paper.file_url}" target="_blank" class="btn-download">👁 View</a>
        <a href="#" onclick="forceDownload(event, '${paper.file_url}', '${paper.subject}_${paper.university}')" class="btn-download" style="border-color:#3fb950; color:#3fb950;">⬇️ Download</a>
      </div>
    `;
    papersList.appendChild(card);
  });
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  document.getElementById('filterUniversity').value = '';
  document.getElementById('filterFaculty').value = '';
  document.getElementById('filterYear').value = '';
  document.getElementById('filterSemester').value = '';
  document.getElementById('papersList').innerHTML = '';
  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('resultsCount').textContent = '';
}

async function forceDownload(e, url, filename) {
  e.preventDefault();
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  } catch (err) {
    window.open(url, '_blank');
  }
}

// Search on Enter key
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') searchPapers();
    });
  }
});