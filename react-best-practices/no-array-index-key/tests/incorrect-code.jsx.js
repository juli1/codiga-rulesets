things.map((thing, i) => (
  <Hello key={i} />
));

things.map((thing, idx) => (
  <Hello key={idx} />
));

things.map((thing, index) => (
  <Hello key={index} />
));

things.map((thing, index, arr) => (
  <Hello key={index} />
));