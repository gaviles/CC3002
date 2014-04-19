package Processors;

public class DataProcessor {
	
	private int maximum,minimum,gap;
	private String textData;
	private int[] data;
	
	public DataProcessor(String string){
		setData(string);
	}
	public int[] parseData(){
		return parseData(textData);
	}
	public void setData(String string){
		textData = string;
		data = parseData();
	}
	public int[] parseData(String string){
		
		String[] data = string.split(",");		
		
		int[] numbers = new int[data.length];
		
		maximum = Integer.MIN_VALUE;
		minimum = Integer.MAX_VALUE;
		
		for(int i = 0; i < data.length ; i++ ){
			
			numbers[i] = Integer.parseInt(data[i]);
			if(numbers[i]>maximum){
				maximum = numbers[i];
			}
			if(numbers[i]<minimum){
				minimum = numbers[i];
			}
		}
		
		gap = maximum-minimum;
		return numbers;
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
	// Returns the percentage of the given number respect of the maximum 
	// number in the data
	public double getPercentaje(int number){
		return (double)number*100 / getMaximum();		
	}
	
	// Return the gap, defined as the difference between the maximum and the minimum 
	// numbers in the data
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
}
