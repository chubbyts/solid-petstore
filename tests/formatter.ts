import beautify from 'js-beautify';

export const formatHtml = (html: string): string => {
  return beautify.html(html, {
    indent_size: 2,
    wrap_line_length: 120,
    inline: [],
  });
};
