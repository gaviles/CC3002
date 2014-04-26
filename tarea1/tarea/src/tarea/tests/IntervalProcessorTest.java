package tarea.tests;

import static org.junit.Assert.*;

import org.junit.Test;

import tarea.processors.*;

public class IntervalProcessorTest {

	@Test
	// Test interval as unit interval example [3,3]
	public void test1() {
		IntervalProcessor interval = new IntervalProcessor(3,3);
		
		assertEquals( 0, interval.getSize() );
		assertTrue( interval.addNumber(3) );
		assertFalse( interval.addNumber(4) );
		assertEquals( 1,interval.getSize() );
		assertTrue( interval.getInterval().equals("3") );
	}
	
	@Test
	// Test interval as a real interval (positive) [10,20]
	public void test2() {
		
		IntervalProcessor interval = new IntervalProcessor(10,20);
		assertEquals( 0, interval.getSize() );
		assertTrue( interval.addNumber(13) );
		assertTrue( interval.addNumber(15) );
		assertTrue( interval.addNumber(19) );
		assertTrue( interval.addNumber(10) );
		assertTrue( interval.addNumber(20) );
		assertTrue( interval.getInterval().equals("[ 10 , 20 ]") );
		interval.setHoldMaximum(false);
		assertFalse( interval.addNumber(20) );
		assertFalse( interval.addNumber(4) );
		assertEquals( 5,interval.getSize() );
		assertTrue( interval.getInterval().equals("[ 10 , 20 [") );
	}
	
	@Test
	// Test interval as a real interval (positive) ]10,20]
	public void test3() {
		
		IntervalProcessor interval = new IntervalProcessor(10,20);
		interval.setHoldMinimum(false);
		assertEquals( 0, interval.getSize() );
		assertTrue( interval.addNumber(13) );
		assertTrue( interval.addNumber(15) );
		assertTrue( interval.addNumber(19) );
		assertFalse( interval.addNumber(10) );
		assertTrue( interval.addNumber(20) );
		assertFalse( interval.addNumber(4) );
		assertEquals( 4,interval.getSize() );
		assertTrue(interval.getInterval().equals("] 10 , 20 ]") );
	}
	
	@Test
	// Test interval as a real interval (positive) [10,20[
	public void test4() {	
		IntervalProcessor interval = new IntervalProcessor(10,20);
		interval.setHoldMaximum(false);
		assertEquals( 0, interval.getSize() );
		assertTrue( interval.addNumber(13) );
		assertTrue( interval.addNumber(15) );
		assertTrue( interval.addNumber(19) );
		assertTrue( interval.addNumber(10) );
		assertFalse( interval.addNumber(20) );
		assertFalse( interval.addNumber(4) );
		assertEquals( 4,interval.getSize() );
		assertTrue( interval.getInterval().equals("[ 10 , 20 [") );
	}
	@Test
	// Test interval calculation in limit cases  ]-10,0] and ]0,10]
	public void test5() {
		IntervalProcessor interval = new IntervalProcessor(0,10);
		assertEquals( 0, interval.getSize() );
		assertTrue( interval.addNumber(0) );
		assertTrue( interval.addNumber(10) );
		
		interval = new IntervalProcessor(-10,0);
		assertEquals( 0, interval.getSize() );
		assertTrue( interval.addNumber(-10) );
		assertTrue( interval.addNumber(0) );
	}
	 
	@Test
	// Test interval as a real interval (negative) ]-20,-10]
	public void test6() {	
		IntervalProcessor interval = new IntervalProcessor(-20,-10);
		interval.setHoldMinimum(false);
		assertEquals( 0, interval.getSize() );
		assertTrue( interval.addNumber(-13) );
		assertTrue( interval.addNumber(-15) );
		assertTrue( interval.addNumber(-19) );
		assertTrue( interval.addNumber(-10) );
		assertFalse( interval.addNumber(-20) );
		assertFalse( interval.addNumber(4) );
		assertEquals( 4,interval.getSize() );
		assertTrue( interval.getInterval().equals("] -20 , -10 ]") );
	} 
}
