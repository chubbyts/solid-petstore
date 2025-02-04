import style_html from 'js-beautify/js/src/html';

export const formatHtml = (html: string): string => {
  return style_html(html, {
    indent_size: 2,
    wrap_line_length: 120,
    inline: [],
  });
};
