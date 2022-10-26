import sm64_120_stars from './120star.json';
import sm64_70_stars from './70star.json';

function toPancake(data, minimumRuns = 5) {
  return [...new Set(data.map((r) => r.name))].map((name) => {
    return {
      name: name,
      data: data
        .filter((r) => r.name === name)
        .map((r) => {
          let date = r.date;
          if (date === null)
            date = r.submitted;
          return {
            x: +new Date(date),
            y: r.time,
          };
        })
        .sort((a, b) => {
          return a.x < b.x;
        }),
    };
  }).filter(r => {
    return r.data.length > minimumRuns;
  });
}

export const sm64runs120stars = toPancake(sm64_120_stars);

export const sm64runs70stars = toPancake(sm64_70_stars);
