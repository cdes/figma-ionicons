import { Global, jsx } from '@emotion/core';
import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import IconButton from './components/icon-button';
import SearchInput from './components/search-input';
import theme from './theme';
import './ui.css';
import useSearch from './use-search';
import IconsContext from './icons-context';
import { FixedSizeGrid as Grid } from 'react-window';

let version;

function App() {
  const [query, setQuery] = useState(' ');
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState([]);
  const [css, setCSS] = useState('');
  const [isMD, setMD] = useState(false);

  useEffect(() => {
    (async () => {
      const packageResponse = await fetch(
        'https://data.jsdelivr.com/v1/package/npm/ionicons'
      );
      const packageJson = await packageResponse.json();

      version = packageJson.tags.latest;

      const data = await Promise.all([
        fetch(
          `https://cdn.jsdelivr.net/npm/ionicons@${version}/dist/css/ionicons.min.css`
        ),
        fetch(
          `https://cdn.jsdelivr.net/gh/ionic-team/ionicons@${version}/src/data.json`
        ),
      ]);

      const [cssResponse, metaResponse] = data;

      const texts = await Promise.all([
        cssResponse.text(),
        metaResponse.json(),
      ]);

      const json = texts[1].icons.map(({ icons, tags }) => {
        if (icons[0].startsWith('logo-')) {
          return [
            {
              name: icons[0],
              tags: [...tags, 'logo'],
            },
          ];
        }

        return [
          {
            name: icons[0],
            tags: [...tags, 'ios'],
          },
          {
            name: icons[1],
            tags: [...tags, 'md'],
          },
        ];
      });

      const merged = [].concat.apply([], json);

      setMeta(merged);
      setLoading(false);
      setQuery('');
      setCSS(texts[0]);
    })();
  }, []);

  const results = useSearch(query, meta);

  return (
    <IconsContext.Provider value={meta}>
      {loading ? (
        <div
          style={{
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Global
            styles={{ body: { margin: 0, fontFamily: 'Inter, sans-serif' } }}
          />
          Loading
        </div>
      ) : (
        <React.Fragment>
          <style>{css}</style>
          <style>
            {`
              @font-face {
                font-family: "Ionicons";
                src: url("https://cdn.jsdelivr.net/npm/ionicons@${version}/dist/fonts/ionicons.eot?v=4.6.3");
                src: url("https://cdn.jsdelivr.net/npm/ionicons@${version}/dist/fonts/ionicons.eot?v=4.6.3#iefix") format("embedded-opentype"), url("https://cdn.jsdelivr.net/npm/ionicons@${version}/dist/fonts/ionicons.woff2?v=4.6.3") format("woff2"), url("https://cdn.jsdelivr.net/npm/ionicons@${version}/dist/fonts/ionicons.woff?v=4.6.3") format("woff"), url("https://cdn.jsdelivr.net/npm/ionicons@${version}/dist/fonts/ionicons.ttf?v=4.6.3") format("truetype"), url("https://cdn.jsdelivr.net/npm/ionicons@${version}/dist/fonts/ionicons.svg?v=4.6.3#Ionicons") format("svg");
                font-weight: normal;
                font-style: normal;
              }
              `}
          </style>
          <Global
            styles={{ body: { margin: 0, fontFamily: 'Inter, sans-serif' } }}
          />
          <SearchInput
            value={query}
            onChange={event => setQuery(event.target.value)}
            css={{
              position: 'sticky',
              top: 0,
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            }}
            count={meta.length}
          />
          <div css={{ padding: theme.space[2], paddingBottom: 0 }}>
            <Grid
              columnCount={5}
              rowCount={Math.round(results.length)}
              columnWidth={284 / 5}
              rowHeight={284 / 5}
              width={284}
              height={351}
            >
              {({ columnIndex, rowIndex, style }) => {
                const icon = results[rowIndex][columnIndex];
                return icon === undefined ? null : (
                  <IconButton
                    name={icon.name}
                    style={style}
                    version={version}
                  />
                );
              }}
            </Grid>
          </div>
        </React.Fragment>
      )}
    </IconsContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
