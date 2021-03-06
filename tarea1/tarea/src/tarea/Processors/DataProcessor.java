package tarea.processors;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

public class DataProcessor {
	
	private int maximum,minimum,gap;
	private String textData;
	private int[] data;
	private ArrayList<IntervalProcessor> intervals;
	private ArrayList<IntervalProcessor> values;
	
	public DataProcessor(){
	}
	
	public DataProcessor(String string){
		setData(string); 
	}
	public DataProcessor(String[] args){
		parseData(args); 
	}
	public int[] parseData(){
		return parseData(textData);
	}
	public void setData(String string){
		textData = string;
		data = parseData();
	}
	public int[] parseData(String string){
		String[] data = (" ,".concat(string)).split(",");
		return parseData(data);
	}
		
	public int[] parseData(String[] data){
		
		int[] numbers = new int[data.length-1];
		
		intervals = new ArrayList<IntervalProcessor>();
		values = new ArrayList<IntervalProcessor>();
		
		maximum = Integer.MIN_VALUE;
		minimum = Integer.MAX_VALUE;
		
		for(int i = 1; i < data.length ; i++ ){
			
			numbers[i-1] = Integer.parseInt(data[i]);
			
			addToIntervals(numbers[i-1]);
			addToValues(numbers[i-1]);
			
			if(numbers[i-1]>maximum){
				maximum = numbers[i-1];
			}
			if(numbers[i-1]<minimum){
				minimum = numbers[i-1];
			}
		}
		
		gap = maximum-minimum;
		return numbers;
	}
	
	// Calculates the interval of 10 that the number belongs
	public void addToIntervals(int number){
		
		int intervalMinimum = number - number % 10;
		int intervalMaximum = intervalMinimum + 10;
		
		if( intervalMinimum > number ){
			intervalMaximum = intervalMinimum;
			intervalMinimum = intervalMaximum - 10;
		}
		
		addValueTo(number, intervals, true, false, intervalMaximum, intervalMinimum);
	}
	
	// add the number to a values collection to calculates the number of repetitions of the same number
	public void addToValues(int number){
		addValueTo(number, values, true, true, number, number);
	}
	
	// General propose adder, adds values to the given ArrayList of IntervalProcessors 
	private void addValueTo(int number, ArrayList<IntervalProcessor> intervalsList, boolean holdMaximum, boolean holdMinimum, int intervalMaximum, int intervalMinimum){
		boolean createInterval = true;
		for(IntervalProcessor interval: intervalsList){
			if( interval.addNumber(number) ){
				createInterval = false;
				break;
			}
		}
		if(createInterval){
			IntervalProcessor interval = new IntervalProcessor(number,number);
			interval.setHoldMaximum(holdMaximum);
			interval.setHoldMinimum(holdMinimum);
			interval.setMaximum(intervalMaximum);
			interval.setMinimum(intervalMinimum);
			interval.addNumber(number);
			intervalsList.add(interval);
		}
	}	
	// This function return the fitting interval of the number given
	// need to receive the number of interval and the number that
	// are going to be analyzed
	// returns the interval between 0 to (intervalsNumber - 1) 
	public int getInterval(int dataNumber, int intervalsNumber){
		
		if(gap > 0){
			return Math.round( (dataNumber - getMinimum() )*(intervalsNumber-1)/( getGap() ) );
		}else{
			return 0;
		}
	}
	
	// Sort the values by number of repetitions
	public void sortValuesBySize(){
		sortListBySize(values);
	}
	
	// Sort the given array list of intervals by the size of the interval
	private void sortListBySize(ArrayList<IntervalProcessor> intervalList){
		Collections.sort( intervalList, new Comparator<IntervalProcessor>() {
	        @Override
	        public int compare(IntervalProcessor  interval1, IntervalProcessor  interval2)
	        {
	            return  interval2.getSize() - interval1.getSize();
	        }
	    });
	}
	
	// Return the percentage of the given number in relationship of the maximum number given 
	public int getPercentage(int number){
		return number*100/maximum;
	}
	
	public int getGap(){
		return gap;
	}
	public int getMaximum(){
		return maximum;
	}
	public int[] getParsedData(){
		return data;
	}
	public int getMinimum(){
		return minimum;
	}
	public ArrayList<IntervalProcessor> getValues() {
		return values;
	}
	public ArrayList<IntervalProcessor> getIntervals() {
		return intervals;
	}

	public void sortValuesByRange() {
		Collections.sort( intervals, new Comparator<IntervalProcessor>() {
	        @Override
	        public int compare(IntervalProcessor  interval1, IntervalProcessor  interval2)
	        {
	            return  interval1.getMinimum() - interval2.getMinimum();
	        }
	    });
	}
}
