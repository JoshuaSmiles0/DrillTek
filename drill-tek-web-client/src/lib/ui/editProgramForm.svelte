                         
 <script>
  
   /*
 program prop passed in to define display values when component is opened
  */
   let {program} = $props()

 </script>                        
                         
                         
<div class="field">
                            <label class="label" for="orebody">Orebody</label>
                            <div class="control has-icons-left">
                                <input id="orebody" class="input" name="orebody" type="text" placeholder="Orebody" value={program.orebody} >
                                <span class="icon is-small is-left">
                                  <i class="fas fa-solid fa-location-arrow"></i>
                                </span>
                                </div>
                            </div>

<div class="field">
                            <label class="label" for="location">Location</label>
                            <div class="control has-icons-left">
                                <input id="location" class="input" name="location" type="text" placeholder="Location" value={program.location} >
                                <span class="icon is-small is-left">
                                  <i class="fas fa-solid fa-map-pin"></i>
                                </span>
                                </div>
                            </div>

<div class="field">
                            <label class="label" for="target">Target</label>
                            <div class="control has-icons-left">
                                <input id="target" class="input" name="target" type="text" placeholder="Target" value={program.target} >
                                <span class="icon is-small is-left">
                                  <i class="fas fa-solid fa-bullseye"></i>
                                </span>
                                </div>
                            </div>