package tarea.histograms;

import tarea.Histogram;
import tarea.processors.SparkLineProcessor;

public class SparkLine extends Histogram {

	public SparkLine() {
		textData = "";
		histogramProcessor = new SparkLineProcessor();
	}
	public SparkLine(String string) {
		textData = string;
		histogramProcessor = new SparkLineProcessor(textData);
	}
	public SparkLine(String[] args) {
		histogramProcessor = new SparkLineProcessor(args);
	}
}
