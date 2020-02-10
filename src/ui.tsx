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

let version = 5;

function App() {
  const [query, setQuery] = useState(' ');
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState([]);
  const [isMD, setMD] = useState(false);

  useEffect(() => {
    (async () => {
      const metaResponse = await fetch(
        `https://cdn.jsdelivr.net/npm/ionicons@5/dist/ionicons.json`
      );

      const metaText = await metaResponse.json();

      setMeta(metaText.icons);
      setLoading(false);
      setQuery('');
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
                    version={version.toString()}
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
