<div class="span-17 last">
	<p>
	<strong>Find better foods.</strong> A better body begins with choosing better foods. The data in the tools below is from the USDA Nutrient Database.
	Use the Browse tab below to either browse through the food database or the Search tab to enter the name of a 
	food you're looking for.
	</p>
</div>

<div class="content ads">
	<?php if(ENVIRONMENT != 'development') { $this->load->view('includes/google-adsense-link-horiz-468x15'); } ?>
</div>

<div id="nut_tabs" class="span-17 last">
	<div id="loading">
		Loading Data...
	</div>	

	<ul>
		<li><a href="#tab_browse">Browse Foods</a></li>
		<li><a href="#tab_search">Search Foods</a></li>
		<!-- li><a href="#tab_myfoodlist">My Food List</a></li -->
	</ul>
	
	<div id="tab_browse" class="tab_content">
		<p>Click the tabs below to view items in the nutrition database</p>
		<div id="alpha_tabs">
			<ul>
				<li><a href="a">A</a></li>
				<li><a href="b">B</a></li>
				<li><a href="c">C</a></li>
				<li><a href="d">D</a></li>
				<li><a href="e">E</a></li>
				<li><a href="f">F</a></li>
				<li><a href="g">G</a></li>
				<li><a href="h">H</a></li>
				<li><a href="i">I</a></li>
				<li><a href="j">J</a></li>
				<li><a href="k">K</a></li>
				<li><a href="l">L</a></li>
				<li><a href="m">M</a></li>
				<li><a href="n">N</a></li>
				<li><a href="o">O</a></li>
				<li><a href="p">P</a></li>
				<li><a href="q">Q</a></li>
				<li><a href="r">R</a></li>
				<li><a href="s">S</a></li>
				<li><a href="t">T</a></li>
				<li><a href="u">U</a></li>
				<li><a href="v">V</a></li>
				<li><a href="w">W</a></li>
				<li><a href="x">X</a></li>
				<li><a href="y">Y</a></li>
				<li><a href="z">Z</a></li>
			</ul>
			<div id="nut_items">
				<div id="nut_item_list" class="span-10">
					<table id="browseItemListHeader">
						<thead class="fixedHeader">
							<tr>
								<td class="id"></td><th>Item</th>
							</tr>
						</thead>
					</table>

					<div class="tableContainer">
					  <table id="browseItemListTable">
						<tbody class="scrollContent">
							<tr><td class="id"></td><td class="colDesc">Click the tabs above to view item list.</td></tr>
						</tbody>
					  </table>
					</div>
				</div>
				<div id="nut_info_browse" class="span-7 last">
					<?php  $this->load->view($nutrition_facts);?>
				</div>
			</div>	
		</div>
		
	</div>

	<div id="tab_search" class="tab_content">
			<div>Type the name of the item you want to look up. You can enter multiple words such as "corn flakes".</div>
			<input id="nutrition_input" type="text" name="nutrition_input" value="" size="98" />
			<div id="nut_info_search">
				<?php  $this->load->view($nutrition_facts_horiz);?>
			</div>

	</div>

	<!-- div id="tab_myfoodlist" class="tab_content">
		<div id="my_nut_list" class="span-17">
			<h3>My Food List</h3>
			<table class="foodList" border="0">
				<thead>
					<tr><th class="id"></th><th>Item</th><th>Calories</th><th></th></tr>
				</thead>
				<tfoot>
					<tr><th class="id"></th><th>Total</th><th></th><th></th></tr>
					</tfoot>
				<tbody>
					<tr><th colspan="3">Breakfast</th></tr>
					<tr><td class="id"></td><td class="colDesc" colspan=3>No Items In List</td></tr>
					<tr><td class="id"></td><td class="colDesc">Data</td><td class="colCal">Data</td><td class="del"><a href="" title="Remove from list">X</a></td></tr>
				</tbody>
				<tbody>
					<tr><th colspan="3">Lunch</th></tr>
					<tr><td class="id"></td><td class="colDesc" colspan=3>No Items In List</td></tr>
				</tbody>
				<tbody>
					<tr><th colspan="3">Dinner</th></tr>
					<tr><td class="id"></td><td class="colDesc" colspan=3>No Items In List</td></tr>
				</tbody>
				<tbody>
					<tr><th colspan="3">Snacks</th></tr>
					<tr><td class="id"></td><td class="colDesc" colspan=3>No Items In List</td></tr>
				</tbody>
			</table>
			<div class="section">
				<div class="content" id="action_buttons">
					<hr />
					<button id="clear_foodlist" type="button" class="button blue">Clear List</button>
					<button id="print_foodlist" type="button" class="button blue">Print List</button>
				</div>
			</div>
		</div>
	</div -->
</div> <!-- end nut_tabs -->
<div class="content ads">
	<?php if(ENVIRONMENT != 'development') { $this->load->view('includes/google-adsense-link-horiz-468x15'); } ?>
</div>

