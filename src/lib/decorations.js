// Central registry of animated-SVG decorations.
// Each preset is consumed by <AnimatedSvg preset="..." />.
//
// Fields (all optional except src):
//   src        path to the SVG in /static                        (required)
//   direction  reveal order: 'ltr' | 'rtl' | 'ttb' | 'btt'       (default 'ltr')
//   width      CSS width of the wrapper                          (default '100%')
//   prerender  0–1 fraction shown immediately, rest reveal       (default 0.5)
//   reveal     viewport fraction over which the sweep completes  (default 0.35)
//
// To add a decoration: drop the SVG in /static/assets, give the lines/dots
// pulse classes (see lateral.svg), then add a named entry here.
export const decorations = {
  aboutProjects: {
    src: '/assets/lateral.svg',
    direction: 'rtl',
    width: '60%',
    prerender: 0.3
  }
};
