package tarea.Histograms;

import tarea.Histogram;
import tarea.Processors.SparkLineProcessor;

public class SparkLine extends Histogram {

	public SparkLine(String string) {
		super();
		textData = string;
		histogramProcessor = new SparkLineProcessor(textData);
	}
}
