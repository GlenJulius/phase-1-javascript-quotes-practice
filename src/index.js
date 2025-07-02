document.addEventListener('DOMContentLoaded', () => {
  const quoteList = document.getElementById('quote-list');
  const quoteForm = document.getElementById('new-quote-form');

  // Fetch and render quotes
  fetch('http://localhost:3000/quotes?_embed=likes')
    .then(res => res.json())
    .then(quotes => {
      quotes.forEach(renderQuote);
    });

  // Render a single quote
  function renderQuote(quote) {
    const li = document.createElement('li');
    li.className = 'quote-card';
    li.innerHTML = `
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes ? quote.likes.length : 0}</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>
    `;

    // Like button
    li.querySelector('.btn-success').addEventListener('click', () => {
      fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          quoteId: quote.id,
          createdAt: Math.floor(Date.now() / 1000)
        })
      })
      .then(res => res.json())
      .then(() => {
        const span = li.querySelector('span');
        span.textContent = parseInt(span.textContent) + 1;
      });
    });

    // Delete button
    li.querySelector('.btn-danger').addEventListener('click', () => {
      fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: 'DELETE'
      })
      .then(() => li.remove());
    });

    quoteList.appendChild(li);
  }

  // Handle new quote form
  quoteForm.addEventListener('submit', e => {
    e.preventDefault();
    const newQuote = {
      quote: e.target.quote.value,
      author: e.target.author.value
    };
    fetch('http://localhost:3000/quotes', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newQuote)
    })
    .then(res => res.json())
    .then(quote => {
      quote.likes = [];
      renderQuote(quote);
      quoteForm.reset();
    });
  });
});