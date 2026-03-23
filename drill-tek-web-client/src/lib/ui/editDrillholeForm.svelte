<script>
  
  /*
  Drillhole prop passed in to define display values when component is opened
  */
   let {drillhole} = $props()

 </script>    




<div class="field">
                            <label class="label" for="xcoord">Easting</label>
                            <div class="control has-icons-left">
                                <input id="xcoord" class="input" name="xcoord" type="text" placeholder="Hole X Coordinate" value={drillhole.xcoord} >
                                <span class="icon is-small is-left">
                                  <i class="fas fa-solid fa-map-pin"></i>
                                </span>
                                </div>
                            </div>

<div class="field">
                            <label class="label" for="ycoord">Northing</label>
                            <div class="control has-icons-left">
                                <input id="ycoord" class="input" name="ycoord" type="text" placeholder="Hole Y Coordinate" value={drillhole.ycoord} >
                                <span class="icon is-small is-left">
                                  <i class="fas fa-solid fa-map-pin"></i>
                                </span>
                                </div>
                            </div>

<div class="field">
                            <label class="label" for="zcoord">Elevation</label>
                            <div class="control has-icons-left">
                                <input id="zcoord" class="input" name="zcoord" type="text" placeholder="Hole Z Coordinate" value={drillhole.zcoord} >
                                <span class="icon is-small is-left">
                                  <i class="fas fa-solid fa-map-pin"></i>
                                </span>
                                </div>
                            </div>

<div class="field">
                            <label class="label" for="dip">Dip</label>
                            <div class="control has-icons-left">
                                <input id="dip" class="input" name="dip" type="text" placeholder="Drillhole inclination" value={drillhole.dip} >
                                <span class="icon is-small is-left">
                                  <i class="fas fa-solid fa-compass"></i>
                                </span>
                                </div>
                            </div>

<div class="field">
                            <label class="label" for="azimuth">Azimuth</label>
                            <div class="control has-icons-left">
                                <input id="azimuth" class="input" name="azimuth" type="text" placeholder="Drillhole azimuth" value={drillhole.azimuth} >
                                <span class="icon is-small is-left">
                                  <i class="fas fa-solid fa-compass"></i>
                                </span>
                                </div>
                            </div>


<div class="field">
                            <label class="label" for="length">Length</label>
                            <div class="control has-icons-left">
                                <input id="length" class="input" name="length" type="text" placeholder="Drillhole Length" value={drillhole.length} >
                                <span class="icon is-small is-left">
                                  <i class="fas fa-solid fa-ruler"></i>
                                </span>
                                </div>
                            </div>

<div class="field">
                            <label class="label" for="type">Type</label>
                            <div id="type" class="control has-icons-left">
                            <div class="select">
                            <select>
                            {#if drillhole.type === 1}
                                <option value=1 selected>Exploration</option>
                                <option value=2>Infill</option>
                            {/if}
                            {#if drillhole.type === 2}
                                <option value=1>Exploration</option>
                                <option value=2 selected>Infill</option>
                            {/if}
                        
                            </select>
                            </div>
                                <span class="icon is-small is-left">
                                  <i class="fas fa-solid fa-bullseye"></i>
                                </span>
                                </div>
                            </div>                            