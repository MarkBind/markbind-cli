/* eslint-disable no-undef */

const pageTitles = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  prefetch: {
    cache: false,
    transform(response) {
      return response.pages;
    },
    url: '../../site.json',
  },
});

pageTitles.initialize();

$('#bloodhound .typeahead')
  .typeahead(
    {
      hint: true,
      highlight: true,
      minLength: 1,
    },
    {
      name: 'pageTitle',
      displayKey: 'title',
      source: pageTitles,
    }).on('typeahead:select', (event, data) => {
    window.location.pathname = data.src.replace('.md', '.html');
  });
