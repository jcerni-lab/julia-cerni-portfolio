const projectPages = {
  restaurant: 'original-projects/Restaurant Ordering App Redesign 3b3ba40e4ec0805480c0c3639f96dfd7.html',
  roots: 'original-projects/App Design Prototype 2fdba40e4ec080eb8ebdfed311805b42.html',
  photos: 'original-projects/iOS Photos App Redesign 2e6ba40e4ec081029047cef333d62f08.html',
  olympics: 'original-projects/Olympic Data Analysis 2e6ba40e4ec08166940acfc15562e46b.html',
  illustration: 'original-projects/Digital Illustration 2e6ba40e4ec08023bf45f0e9ae4a913c.html'
};

const dialog = document.querySelector('.project-dialog');
const frame = document.querySelector('.project-frame');
const cards = document.querySelectorAll('.project-card');
const closeButton = document.querySelector('.dialog-close');

function setProject(card) {
  const page = projectPages[card.dataset.project];
  if (!page) return;
  frame.title = `${card.querySelector('h3')?.textContent || 'Project'} case study`;
  frame.src = page;
  dialog.showModal();
}

const previewCards = document.querySelectorAll('.project-card[data-project="restaurant"], .project-card[data-project="roots"]');
const stopCoverPreview = (card) => {
  const video = card.querySelector('.cover-preview-video');
  if (!video) return;
  card.querySelector('.cover')?.classList.remove('previewing');
  video.pause();
  try { video.currentTime = 0; } catch {}
};
previewCards.forEach((card) => {
  const video = card.querySelector('.cover-preview-video');
  const cover = card.querySelector('.cover');
  if (!video || !cover) return;
  let previewRequested = false;
  const startPreview = () => {
    previewRequested = true;
    video.muted = true;
    const playback = video.play();
    if (playback) playback.then(() => {
      if (previewRequested) cover.classList.add('previewing');
      else stopCoverPreview(card);
    }).catch(() => {});
  };
  const stopIfInactive = () => {
    if (!card.matches(':hover') && !card.contains(document.activeElement)) {
      previewRequested = false;
      stopCoverPreview(card);
    }
  };
  card.addEventListener('pointerenter', startPreview);
  card.addEventListener('pointerleave', stopIfInactive);
  card.addEventListener('focusin', startPreview);
  card.addEventListener('focusout', (event) => {
    if (!card.contains(event.relatedTarget)) stopIfInactive();
  });
});

cards.forEach((card) => {
  card.addEventListener('click', () => {
    stopCoverPreview(card);
    setProject(card);
  });
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      stopCoverPreview(card);
      setProject(card);
    }
  });
});

closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => { frame.removeAttribute('src'); });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
