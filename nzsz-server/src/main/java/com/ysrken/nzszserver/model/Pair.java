package com.ysrken.nzszserver.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Pair<T1, T2> {
	private T1 key;
	private T2 value;
}
