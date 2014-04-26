package tarea.processors;

import java.util.ArrayList;

public class IntervalProcessor {
	
	private int maximum,minimum;
	private ArrayList<Integer> data;
	private boolean holdMaximum, holdMinimum;
	
	public IntervalProcessor(int minimum,int maximum){
		data = new ArrayList<Integer>();
		setMinimum(minimum);
		setMaximum(maximum);
		setHoldMaximum(true);
		setHoldMinimum(true);
	}
	public void setHoldMaximum(boolean  holding){
		holdMaximum = holding;
	}
	public void setHoldMinimum(boolean  holding){
		holdMinimum = holding;
	}
	
	public boolean addNumber(int number){
		// verify if you are adding the number to the right interval
		if( number <= maximum && number >= minimum ){
			if( !holdMaximum && number == maximum  ){
				return false;
			}
			if( !holdMinimum && number == minimum  ){
				return false;
			}
			data.add(number);
			return true;
		}
		return false;
	}
	
	public void setMaximum(int number){
		maximum = number;
	}
	
	public void setMinimum(int number){
		minimum = number;
	}
	
	public int getSize(){
		return data.size();
	}
	public String getInterval() {
		
		if( maximum == minimum ){
			return String.valueOf(maximum);
		}
		
		StringBuilder  interval = new StringBuilder();
		
		if( holdMinimum ){
			interval.append("[ ");
		}else{
			interval.append("] ");
		}
		
		interval.append(String.valueOf(minimum));
		interval.append(" , ");
		interval.append(String.valueOf(maximum));
		
		if( holdMaximum ){
			interval.append(" ]");
		}else{
			interval.append(" [");
		}

		return interval.toString();
	}
	public int getMaximum() {
		return maximum;
	}
	public int getMinimum() {
		return minimum;
	}
	public ArrayList<Integer> getData() {
		return data;
	}
}
