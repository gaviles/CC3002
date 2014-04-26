package tarea.tests;

import static org.junit.Assert.*;

import java.util.ArrayList;

import org.junit.Test;

import tarea.processors.*;

public class DotPlotProcessorTest {

	@Test
	public void test() {
		DotPlotProcessor hist = new DotPlotProcessor("1,1,1,1,1,2,3,4,5,5,5,5,2,2,3");
		ArrayList<IntervalProcessor> list = hist.getValues();
		assertEquals( list.get(0).getSize() , 5 );
	}
}
