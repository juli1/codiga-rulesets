things.forEach((thing) => (
  <Hello key={thing.id} />
));

things.forEach((thing, index) => (
  <Hello key={thing.id} />
));

things.forEach((thing, index, arr) => (
  <Hello key={arr[index].id} />
));