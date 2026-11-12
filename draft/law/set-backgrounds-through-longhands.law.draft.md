# Set backgrounds through longhands

<!-- TODO: one sentence saying what the law protects. It is ruled with the law; leave this TODO until it is. The title is a working title, also pending a ruling. -->

## Rule

- Set a background through the longhand you mean: `background-color` for a color, `background-image` for an image or gradient. Never use the `background` shorthand, which resets every sub-property it doesn't name; the one exception is `background: none`, a deliberate full reset. Other shorthands are fine.

## Why

<!-- TODO: one rationale paragraph. It stays a TODO until it is ruled; never draft a rationale to fill it. -->

- **Shorthands reset what they omit:**
  - "When values are omitted from a shorthand form, unless otherwise defined, each “missing” sub-property is assigned its initial value." ([CSS Cascading and Inheritance Level 5][css-cascade-shorthand])
  - "Component properties not set in the `background` shorthand property value declaration are set to their default values." ([MDN, `background`][mdn-background])
  - `background` also "resets the following CSS properties to their initial values": `background-blend-mode` ([MDN, `background`][mdn-background-reset]).
- **Noted disagreement:** `stylelint-config-standard` enables [`declaration-block-no-redundant-longhand-properties`][redundant-longhand] ([config][stylelint-config-standard]), which says: "Disallow redundant longhand properties within declaration-block."

## Enforcement

- `@knix-law/set-backgrounds-through-longhands-declaration-property-value-allowed-list`, the plugin's copy of core [`declaration-property-value-allowed-list`][allowed-list], at `error`: `{ background: ['none'] }`.
  - It reports every other `background` value, including `var(--bg)` and a layer list such as `none, url(x.png)` (probed).
  - `background: none !important` passes (probed).
- Where a repository extends `stylelint-config-standard`: `declaration-block-no-redundant-longhand-properties` at `error`: `[true, { ignoreShorthands: ['background'] }]` ([`ignoreShorthands`][ignore-shorthands]).
  - Without it, the preset asks for the `background` shorthand once a block sets every background longhand (probed on 40.0.0).
- **Known gaps (probed):** a property written in uppercase, such as `BACKGROUND: red`, is not reported, with or without `stylelint-config-standard`.

## Related

- [Use design tokens for style values](use-design-tokens-for-style-values.law.draft.md) governs the values a background takes.

[css-cascade-shorthand]: https://github.com/w3c/csswg-drafts/blob/a3e7fce3510dbffd4cc39c8358597824c4de5e09/css-cascade-5/Overview.bs#L326-L328
[mdn-background]: https://github.com/mdn/content/blob/35b1d907e22f58fcd01fc5d3d22f1e73089c7f3d/files/en-us/web/css/reference/properties/background/index.md?plain=1#L119
[mdn-background-reset]: https://github.com/mdn/content/blob/35b1d907e22f58fcd01fc5d3d22f1e73089c7f3d/files/en-us/web/css/reference/properties/background/index.md?plain=1#L65-L69
[stylelint-config-standard]: https://github.com/stylelint/stylelint-config-standard/blob/bdd37117cce5120741286143d44dc2fafdbb1500/index.js#L61
[redundant-longhand]: https://github.com/stylelint/stylelint/blob/bc06c7cdb1413de3d8dc939b33af138ab7e59df1/lib/rules/declaration-block-no-redundant-longhand-properties/README.md?plain=1#L3
[ignore-shorthands]: https://github.com/stylelint/stylelint/blob/bc06c7cdb1413de3d8dc939b33af138ab7e59df1/lib/rules/declaration-block-no-redundant-longhand-properties/README.md?plain=1#L271-L274
[allowed-list]: https://github.com/stylelint/stylelint/blob/bc06c7cdb1413de3d8dc939b33af138ab7e59df1/lib/rules/declaration-property-value-allowed-list/README.md?plain=1#L3
