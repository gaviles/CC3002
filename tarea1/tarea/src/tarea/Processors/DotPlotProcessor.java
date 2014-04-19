package tarea.Processors;

import java.util.ArrayList;

public class DotPlotProcessor implements HistogramProcessor {
	
	private DataProcessor dataProcessor;
	private String histogram;
	private String[] intervalsValue;

	public DotPlotProcessor(String string){
		intervalsValue = new String[20];
		intervalsValue[0] = "*";
		for(int i = 1; i < 20 ; i++ ){
			intervalsValue[i] = intervalsValue[(i-1)].concat("*"); 
		}
		setData(string);	
	}
	
	public void setData(String string){
		dataProcessor = new DataProcessor(string);
		generateHistogram();
	}
	private void generateHistogram(){
		
		ArrayList<IntervalProcessor> intervals = dataProcessor.getIntervals();
		
		for(IntervalProcessor interval: intervals){
			
			String sms = interval.getInterval().concat("  ").concat(String.valueOf(interval.getSize()));
			System.out.println(sms);
		}
	}
	
	public String getHistogram() {
		return histogram;
	}
}
