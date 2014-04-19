package tarea.tests;

import static org.junit.Assert.*;

import org.junit.Test;

import tarea.Histogram;
import tarea.Histograms.DotPlot;

public class DotPlotTest {

	@Test
	public void test() {
		Histogram hist = new DotPlot("1,1,1,1,1,2,3,4,5,5,5,5,5,10,11,12,19,20,21,-10,-9,-8,0,4,-7,-7");
	}

}
