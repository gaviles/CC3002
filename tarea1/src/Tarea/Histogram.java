package Tarea;

import Processors.HistogramProcessor;

public abstract class Histogram {
	protected String textData;
	protected HistogramProcessor histogramProcessor;
	
	public Histogram(){
		super();
	}
	public String getHistogram(){
		return histogramProcessor.getHistogram();
	}
	public void setData(String string){
		textData = string;
		histogramProcessor.setData(textData);
	}
	public void print(){
		System.out.println(getHistogram());
	}
}
