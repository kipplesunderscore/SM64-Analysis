<script lang="ts">
  import * as Pancake from '@sveltejs/pancake';

  import { sm64runs70stars as runs } from '$lib/runs';

  let x1 = +Infinity;
  let x2 = -Infinity;
  let y1 = +Infinity;
  let y2 = -Infinity;
  runs.forEach((run) => {
    run.data.forEach((d) => {
      if (d.x < x1) x1 = d.x;
      if (d.x > x2) x2 = d.x;
      if (d.y < y1) y1 = d.y;
      if (d.y > y2) y2 = d.y;
    });
  });
  let closest;
  let nameFilter = '';
  let numberOfRuns = 20;
  $: regex = nameFilter ? new RegExp(nameFilter, 'i') : null;

  $: runLength = numberOfRuns ? numberOfRuns : 2;

  function filterRun(run) {
    let a = regex ? regex.test(run.name) : true;
    let b = run.data.length >= runLength;

    return a && b;
  }

  $: filtered = numberOfRuns || nameFilter ? runs.filter(filterRun) : runs;
  $: points = filtered.reduce((points, run) => {
    return points.concat(
      run.data.map((d) => ({
        x: d.x,
        y: d.y,
        run,
      }))
    );
  }, []);

  function timeFormat(sec_num) {
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
  }
</script>

<div class="mx-auto max-w-7xl">
  <label class="block text-gray-500 font-bold" for="name_filter">Filter by player name</label>
  <input class="m-1 block outline" id="name_filter" placeholder="Type to filter name" bind:value={nameFilter} /><br />
  <label class="block text-gray-500 font-bold" for="run_count_filter">Filter by number of submitted runs</label>
  <input class="m-1 block outline" id="run_count_filter" placeholder="Type to filter number of runs" bind:value={numberOfRuns} />
  <!-- {JSON.stringify(runs, null, 2)} -->
  <chart class="chart">
    <Pancake.Chart {x1} {x2} {y1} {y2}>
      <Pancake.Grid horizontal count={5} let:value>
        <div class="grid-line horizontal"><span>{timeFormat(value)}</span></div>
      </Pancake.Grid>

      <Pancake.Grid vertical count={5} let:value>
        <span class="x-label">{new Date(value).toLocaleDateString()}</span>
      </Pancake.Grid>
      <Pancake.Svg>
        {#each filtered as run}
          <Pancake.SvgLine data={run.data} let:d>
            <path class="data" {d} />
          </Pancake.SvgLine>
        {/each}
        {#if closest}
          <Pancake.SvgLine data={closest.run.data} let:d>
            <path class="highlight" {d} />
          </Pancake.SvgLine>
        {/if}
      </Pancake.Svg>
      {#if closest}
        <Pancake.Point x={closest.x} y={closest.y}>
          <span class="annotation-point" />
          <div
            class="annotation"
            style="transform: translate(-{100 * ((closest.x - x1) / (x2 - x1))}%,0)"
          >
            <strong>{closest.run.name}</strong>
            <span>{new Date(closest.x).toLocaleDateString()}: {timeFormat(closest.y)} </span>
          </div>
        </Pancake.Point>
      {/if}
      <Pancake.Quadtree data={points} bind:closest />
    </Pancake.Chart>
  </chart>
</div>

<style>
  .chart {
    display: inline-block;
    width: 100%;
    height: 1000px;
    padding: 3em 0 2em 2em;
    margin: 0 0 36px 0;
  }
  input {
    font-size: inherit;
    font-family: inherit;
    padding: 0.5em;
  }
  .grid-line {
    position: relative;
    display: block;
  }
  .grid-line.horizontal {
    width: calc(100% + 2em);
    left: -2em;
    border-bottom: 1px dashed #ccc;
  }
  .grid-line span {
    position: absolute;
    left: 0;
    bottom: 2px;
    font-family: sans-serif;
    font-size: 14px;
    color: #999;
  }
  .x-label {
    position: absolute;
    width: 4em;
    left: -2em;
    bottom: -22px;
    font-family: sans-serif;
    font-size: 14px;
    color: #999;
    text-align: center;
  }
  path.data {
    stroke: rgba(0, 0, 128, 1);
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 3px;
    fill: none;
  }
  .highlight {
    stroke: #ff3e00;
    fill: none;
    stroke-width: 4;
  }
  .annotation {
    position: absolute;
    white-space: nowrap;
    bottom: 1em;
    line-height: 1.2;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 0.2em 0.4em;
    border-radius: 2px;
  }
  .annotation-point {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #ff3e00;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
  .annotation strong {
    display: block;
    font-size: 20px;
  }
  .annotation span {
    display: block;
    font-size: 14px;
  }
</style>
